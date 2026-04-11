// End-to-end: Share button copies a design URL, navigating to that
// URL restores the floor + border + grid size + ambient.

import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://localhost:3000/home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('1. Pick a floor + border and save to recents');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);
  await page.getByText('Save to recents').click();
  await page.waitForTimeout(300);

  await page.getByText(/^Victorian/).click();
  await page.waitForTimeout(300);
  const wrappers = await page.locator('.svg-wrapper').all();
  if (wrappers.length > 1) {
    await wrappers[1].click();
    await page.waitForTimeout(300);
    await page.getByText('Save to recents').click();
    await page.waitForTimeout(300);
  }

  console.log('2. Bump grid size to 5');
  await page.getByLabel('More rows').click();
  await page.waitForTimeout(100);
  await page.getByLabel('More rows').click();
  await page.waitForTimeout(100);

  console.log('3. Click Share → reads clipboard');
  await page.getByRole('button', { name: 'Share' }).click();
  await page.waitForTimeout(400);

  const status = await page
    .locator('span[aria-live="polite"]')
    .filter({ hasText: /Link copied/ })
    .textContent();
  console.log(`   status: "${status}"`);

  const url = await page.evaluate(() => navigator.clipboard.readText());
  console.log(`   clipboard URL: ${url.slice(0, 80)}...`);

  if (!url.includes('#d=')) {
    throw new Error('Share URL does not contain a #d= hash');
  }

  // Decode and print the payload so failures are debuggable.
  const hash = url.split('#d=')[1];
  const b64 = hash.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    hash.length + ((4 - (hash.length % 4)) % 4),
    '='
  );
  const decoded = Buffer.from(b64, 'base64').toString('utf8');
  console.log(`   decoded payload: ${decoded}`);

  console.log('4. Open a FRESH page on the share URL → design restores');
  // Fresh page so Home's mount effect re-runs with the hash
  // present from the start. Playwright's page.goto is a
  // noop-navigate when only the hash differs from the current URL,
  // so we can't just reuse `page` here.
  const restored = await ctx.newPage();
  restored.on('pageerror', (err) => errors.push(err.message));
  restored.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await restored.goto(url, { waitUntil: 'networkidle' });
  await restored.waitForTimeout(600);

  const locHash = await restored.evaluate(() => window.location.hash);
  console.log(`   window.location.hash: "${locHash.slice(0, 40)}..."`);

  // Grid size should be 5 after restore
  const rows = await restored
    .locator('[aria-live="polite"]')
    .first()
    .textContent();
  console.log(`   restored grid rows: ${rows}`);

  const recentTilesOnRestored = await restored
    .locator('[alt][src*="svg"]')
    .count();
  console.log(`   recent tile imgs rendered: ${recentTilesOnRestored}`);

  await restored.screenshot({ path: '/tmp/share-restored.png', fullPage: false });
  await restored.close();

  console.log('5. Hash should be cleared after apply (no re-apply on nav)');
  // Navigate the restored page to /library and back — if the hash
  // wasn't cleared, Home would re-mount with #d=... and add the
  // floor + border AGAIN, so we'd see the recent-slot count jump.
  const revisit = await ctx.newPage();
  revisit.on('pageerror', (err) => errors.push(err.message));
  await revisit.goto(url, { waitUntil: 'networkidle' });
  await revisit.waitForTimeout(400);
  await revisit.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await revisit.waitForTimeout(300);
  await revisit.goto('http://localhost:3000/home', { waitUntil: 'networkidle' });
  await revisit.waitForTimeout(400);
  const revisitHash = await revisit.evaluate(() => window.location.hash);
  console.log(`   hash after revisit: "${revisitHash}"`);
  await revisit.close();

  console.log('6. Unicode-safe encode: design with non-ASCII displayName');
  // Seed a user tile whose displayName contains accented chars,
  // then build a share URL from it. Before the Unicode fix this
  // would throw InvalidCharacterError at btoa time.
  const unicodePage = await ctx.newPage();
  unicodePage.on('pageerror', (err) => errors.push(err.message));
  await unicodePage.goto('http://localhost:3000/library', {
    waitUntil: 'networkidle',
  });
  await unicodePage.evaluate(async () => {
    const { set } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await set('habaneta:user-tiles', [
      {
        id: 'user/patron-floral',
        kind: 'floor',
        family: 'Patrón',
        displayName: 'Patrón floral ñ',
        svgUrl: '/assets/Tile/Contemporary/l05.svg',
        layers: { st0: '#ff0000', st1: '#00ff00' },
        source: 'user',
      },
    ]);
  });
  await unicodePage.reload({ waitUntil: 'networkidle' });
  await unicodePage.waitForTimeout(400);
  // Build a share URL directly via the module — smoke test for
  // the encoder path, independent of UI state.
  const unicodeUrl = await unicodePage.evaluate(async () => {
    const mod = await import('/src/lib/design-url.ts');
    return mod.buildShareUrl({
      floor: { sourceId: 'user/patron-floral', layerOverrides: {} },
    });
  });
  console.log(`   non-ASCII share URL length: ${unicodeUrl.length}`);
  // Round-trip through a fresh page
  const rt = await ctx.newPage();
  rt.on('pageerror', (err) => errors.push(err.message));
  await rt.goto(unicodeUrl, { waitUntil: 'networkidle' });
  await rt.waitForTimeout(400);
  const rtErrors = errors.filter((e) => e.includes('InvalidCharacter'));
  console.log(`   unicode encode errors: ${rtErrors.length}`);
  await rt.close();
  await unicodePage.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });
  await unicodePage.close();

  console.log('7. Missing-source fallback: unknown sourceId');
  const missingUrl = await page.evaluate(async () => {
    const mod = await import('/src/lib/design-url.ts');
    return mod.buildShareUrl({
      floor: { sourceId: 'nonexistent/xyz', layerOverrides: {} },
    });
  });
  const missingPage = await ctx.newPage();
  missingPage.on('pageerror', (err) => errors.push(err.message));
  await missingPage.goto(missingUrl, { waitUntil: 'networkidle' });
  await missingPage.waitForTimeout(800);
  const partialNotice = await missingPage
    .getByText(/partially|Restored|partially/i)
    .isVisible()
    .catch(() => false);
  console.log(`   partial-restore notice visible: ${partialNotice}`);
  await missingPage.close();

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/share-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
