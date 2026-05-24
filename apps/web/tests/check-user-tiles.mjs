import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}/library`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const builtinRows = await page.locator('tbody tr').count();
  console.log(`1. Builtin rows: ${builtinRows}`);

  console.log('2. Write a user tile to IndexedDB (bypassing UI)');
  await page.evaluate(async () => {
    const { set } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await set('habaneta:user-tiles', [
      {
        id: 'user/test-tile-1',
        kind: 'floor',
        family: 'My Uploads',
        displayName: 'Test Tile 1',
        svgUrl: '/assets/Tile/Contemporary/l05.svg',
        layers: { st0: '#ff0000', st1: '#00ff00' },
        source: 'user',
      },
    ]);
  });

  console.log('3. Invalidate the library query (reload)');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const rowsAfter = await page.locator('tbody tr').count();
  console.log(`   Rows after user tile added: ${rowsAfter}`);

  const userBadgeVisible = await page.getByText('Test Tile 1').isVisible();
  console.log(`   "Test Tile 1" visible: ${userBadgeVisible}`);

  // Check the source column shows "user" badge (exact match on the green span)
  const userBadge = await page
    .locator('tbody tr', { hasText: 'Test Tile 1' })
    .getByText('user', { exact: true })
    .isVisible();
  console.log(`   User badge on row: ${userBadge}`);

  await page.screenshot({ path: '/tmp/user-tiles.png', fullPage: true });

  console.log('4. Clean up — remove the user tile');
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/user-tiles-error.png', fullPage: true });
} finally {
  await browser.close();
}
