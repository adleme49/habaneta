// Verifies the SVG upload + import flows sanitize hostile input.
//
// Two attacks:
//   A. Uploading an SVG that contains <script>alert('pwned')</script>
//      and onload handlers. After sanitize, the persisted tile must
//      not contain either and no window.pwned flag must be set.
//   B. Importing a JSON file whose svgUrl is a data: URL carrying a
//      malicious SVG. Same constraint.

import { chromium } from 'playwright';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const tmp = mkdtempSync(path.join(tmpdir(), 'habaneta-xss-'));

// ---- Fixture A: a malicious SVG with every known vector ----
// IMPORTANT: every non-void tag uses a full closing form
// (<div></div>, <iframe></iframe>). `<div/>` and `<iframe/>` are
// NOT self-closing in HTML parsing, so using them causes the
// parser to treat following siblings as descendants — those
// siblings then disappear along with the forbidden parent, which
// would hide test failures.
const HOSTILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" onload="window.__pwned='onload'">
  <script>window.__pwned='script-tag'; alert('pwned');</script>
  <foreignObject width="100" height="100"><div xmlns="http://www.w3.org/1999/xhtml"><iframe src="javascript:window.__pwned='foreignObject'"></iframe></div></foreignObject>
  <image href="https://attacker.example.com/track.svg" width="10" height="10"></image>
  <a href="javascript:window.__pwned='a-href'"><rect class="colora st0" fill="#ff0000" width="100" height="100"></rect></a>
  <rect class="colora st1" fill="#00ff00" width="100" height="100"></rect>
</svg>`;
const hostileSvgPath = path.join(tmp, 'hostile.svg');
writeFileSync(hostileSvgPath, HOSTILE_SVG);

// ---- Fixture B: a JSON import carrying a malicious data: URL ----
const hostileDataUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">` +
      `<script>window.__pwned='via-json-import';</script>` +
      `<rect class="colora st0" fill="#0f0" width="10" height="10"/>` +
      `</svg>`
  );
const hostileJsonPath = path.join(tmp, 'hostile-tiles.json');
writeFileSync(
  hostileJsonPath,
  JSON.stringify(
    [
      {
        id: 'user/hostile-json',
        kind: 'floor',
        family: 'Attacker',
        displayName: 'Hostile Import',
        svgUrl: hostileDataUrl,
        layers: { st0: '#00ff00' },
        source: 'user',
      },
    ],
    null,
    2
  )
);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));

// Track alerts too — if the script runs, alert() fires
page.on('dialog', async (dialog) => {
  errors.push(`DIALOG (XSS fired): ${dialog.message()}`);
  await dialog.dismiss();
});

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}/library`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Clean slate
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('== Attack A: upload hostile SVG ==');
  await page.getByRole('button', { name: 'Upload tile' }).click();
  await page.waitForTimeout(200);
  await page.setInputFiles('#svgfile', hostileSvgPath);
  await page.waitForTimeout(400);

  // Must still detect layers (sanitize is non-lossy for st*)
  const layerText = await page.locator('text=/\\d+ layers detected/').textContent().catch(() => null);
  console.log(`  Layers after sanitize: "${layerText}"`);

  await page.getByLabel('Name').fill('Hostile upload');
  await page.getByRole('button', { name: 'Save tile' }).click();
  await page.waitForTimeout(500);

  const pwnedAfterUpload = await page.evaluate(() => window.__pwned);
  console.log(`  window.__pwned after upload: ${pwnedAfterUpload ?? '(clean)'}`);

  // Inspect what ended up in IDB
  const stored = await page.evaluate(async () => {
    const { get } = await import('/node_modules/.vite/deps/idb-keyval.js');
    const tiles = await get('habaneta:user-tiles');
    return tiles?.[0]?.svgUrl ?? '';
  });
  const decoded = decodeURIComponent(stored.replace(/^data:image\/svg\+xml;[^,]*,/, ''));
  const hasScript = decoded.includes('<script');
  const hasOnload = /onload=/.test(decoded);
  const hasForeign = decoded.includes('<foreignObject');
  const hasRemoteHref = decoded.includes('attacker.example.com');
  const hasJsHref = /javascript:/i.test(decoded);
  console.log(`  Stored SVG contains <script>: ${hasScript}`);
  console.log(`  Stored SVG contains onload=:  ${hasOnload}`);
  console.log(`  Stored SVG contains foreignObject: ${hasForeign}`);
  console.log(`  Stored SVG contains remote href: ${hasRemoteHref}`);
  console.log(`  Stored SVG contains javascript: uri: ${hasJsHref}`);

  // Clean up before attack B
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('\n== Attack B: import hostile JSON ==');
  await page.evaluate(() => {
    window.__pwned = undefined;
  });
  await page.setInputFiles('input[type="file"][accept*="json"]', hostileJsonPath);
  await page.waitForTimeout(600);

  const pwnedAfterImport = await page.evaluate(() => window.__pwned);
  console.log(`  window.__pwned after import: ${pwnedAfterImport ?? '(clean)'}`);

  const storedImport = await page.evaluate(async () => {
    const { get } = await import('/node_modules/.vite/deps/idb-keyval.js');
    const tiles = await get('habaneta:user-tiles');
    return tiles?.[0]?.svgUrl ?? '';
  });
  const decodedImport = decodeURIComponent(
    storedImport.replace(/^data:image\/svg\+xml;[^,]*,/, '')
  );
  console.log(`  Imported SVG contains <script>: ${decodedImport.includes('<script')}`);

  // Clean up
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });

  const allClean =
    !pwnedAfterUpload &&
    !pwnedAfterImport &&
    !hasScript &&
    !hasOnload &&
    !hasForeign &&
    !hasRemoteHref &&
    !hasJsHref &&
    !decodedImport.includes('<script');

  console.log(`\nErrors/dialogs: ${errors.length}`);
  errors.forEach((e) => console.log('  ', e.slice(0, 200)));
  console.log(allClean ? '\n✓ all XSS vectors neutralized' : '\n✗ XSS LEAK DETECTED');
  if (!allClean) process.exitCode = 1;
} catch (e) {
  console.log('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
