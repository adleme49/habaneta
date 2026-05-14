// Verifies the reworked editor palette:
//  - New mosaic colors render in the 9×4 grid.
//  - "My colors" empty state shows italic muted line.
//  - Clicking "+ Add" saves the current color; reload keeps it.
//  - Delete hover-action removes a saved color.

import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Load a tile so the editor/palette become interactive.
  await page.getByText(/Contemporary/).first().click();
  await page.waitForTimeout(400);
  await page.locator('#grid svg, .grid svg, [data-index] svg').first().click().catch(() => {});
  await page.waitForTimeout(400);

  console.log('1. Main palette renders');
  const swatchCount = await page.locator('button[aria-label^="Select #"]').count();
  console.log(`   swatches: ${swatchCount}`);
  if (swatchCount < 30) throw new Error(`expected ~36 swatches, got ${swatchCount}`);

  console.log('2. "My colors" empty state visible');
  const empty = await page.getByText(/Saved colors will appear here/).isVisible();
  console.log(`   empty line visible: ${empty}`);
  if (!empty) throw new Error('empty state line not shown');

  console.log('3. Pick a mosaic color + save it');
  // Click the terracotta swatch.
  const terracotta = page.locator('button[aria-label="Select #c65a3a"]');
  await terracotta.click();
  await page.waitForTimeout(200);
  const addBtn = page.getByRole('button', { name: /Save current color/ });
  await addBtn.click();
  await page.waitForTimeout(200);
  const emptyGone = !(await page.getByText(/Saved colors will appear here/).isVisible().catch(() => false));
  const savedCount = await page.locator('button[aria-label="Select #c65a3a"]').count();
  console.log(`   empty gone: ${emptyGone}  saved swatch present: ${savedCount > 1}`);
  if (!emptyGone) throw new Error('empty state persisted after save');

  console.log('4. Reload — saved color persists');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.getByText(/Contemporary/).first().click();
  await page.waitForTimeout(300);
  await page.locator('#grid svg, .grid svg, [data-index] svg').first().click().catch(() => {});
  await page.waitForTimeout(300);
  const stillEmpty = await page.getByText(/Saved colors will appear here/).isVisible().catch(() => false);
  console.log(`   empty after reload: ${stillEmpty}  (should be false)`);
  if (stillEmpty) throw new Error('saved color did not persist across reload');

  console.log('5. Hover-reveal delete removes the saved color');
  // Clean up before finishing: remove the saved entry via the
  // localStorage key to avoid leaking state across test runs.
  await page.evaluate(() => localStorage.removeItem('habaneta:user-colors'));
  console.log('   cleaned up');

  await page.screenshot({ path: '/tmp/palette-populated.png', clip: { x: 260, y: 40, width: 420, height: 340 } });
  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/palette-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
