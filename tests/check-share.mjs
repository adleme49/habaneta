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

  await page.screenshot({ path: '/tmp/share-restored.png', fullPage: false });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/share-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
