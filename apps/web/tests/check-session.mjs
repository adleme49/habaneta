// End-to-end: session persistence — recent slots, grid size, and
// painted colors survive a page reload via localStorage.

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
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}/home`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Clean slate.
  await page.evaluate(() => localStorage.removeItem('habaneta:session'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('1. Pick a floor tile and save to recents');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);
  await page.getByText('Save to recents').click();
  await page.waitForTimeout(300);

  console.log('2. Bump grid size to 5');
  await page.getByLabel('More rows').click();
  await page.getByLabel('More rows').click();
  await page.waitForTimeout(200);
  const sizeBeforeReload = await page.locator('span.tabular-nums').textContent();
  console.log(`   grid size before reload: ${sizeBeforeReload}`);
  if (sizeBeforeReload !== '5') throw new Error(`expected 5, got ${sizeBeforeReload}`);

  // Verify the floor tile renders on the grid (at least one
  // svg-wrapper inside #grid).
  const gridSvgsBefore = await page.locator('#grid .svg-wrapper').count();
  console.log(`   svg-wrappers in grid before reload: ${gridSvgsBefore}`);
  if (gridSvgsBefore < 1) throw new Error('no tiles rendered on grid before reload');

  console.log('3. Reload → session should persist');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const sizeAfterReload = await page.locator('span.tabular-nums').textContent();
  console.log(`   grid size after reload: ${sizeAfterReload}`);
  if (sizeAfterReload !== '5') {
    throw new Error(`grid size reset on reload: expected 5, got ${sizeAfterReload}`);
  }

  // The grid should still show the floor tile.
  const gridSvgsAfter = await page.locator('#grid .svg-wrapper').count();
  console.log(`   svg-wrappers in grid after reload: ${gridSvgsAfter}`);
  if (gridSvgsAfter < 1) {
    throw new Error('grid lost its floor tile on reload — session persistence broken');
  }

  // Verify the recent strip still has a populated slot (not all empty).
  const recentSlots = await page.evaluate(() => {
    const raw = localStorage.getItem('habaneta:session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session.slots.filter(Boolean).length;
  });
  console.log(`   populated recent slots in localStorage: ${recentSlots}`);
  if (!recentSlots || recentSlots < 1) {
    throw new Error('no recent slots persisted in localStorage');
  }

  console.log('4. Clean up');
  await page.evaluate(() => localStorage.removeItem('habaneta:session'));

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/session-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
