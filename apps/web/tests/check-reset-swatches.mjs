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
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Clean slate
  await page.evaluate(() => localStorage.removeItem('habaneta:presets'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('1. Pick a Contemporary tile');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(400);

  console.log('2. Reset button should be DISABLED with no edits');
  const resetDisabledBefore = await page
    .getByRole('button', { name: 'Reset colors' })
    .isDisabled();
  console.log(`   disabled: ${resetDisabledBefore}`);

  console.log('3. Paint a layer by clicking on the editor SVG');
  // Click a color swatch first
  await page.locator('.border-2.border-black div[title]').first().click().catch(() => {});
  // Pick a random spot in the tile editor (second svg wrapper after the color palette)
  const editorSvg = page.locator('.flex.justify-center .svg-wrapper').first();
  await editorSvg.click({ position: { x: 100, y: 100 } }).catch(() => {});
  await page.waitForTimeout(300);

  console.log('4. Save a preset so we can see its swatches');
  await page.getByRole('button', { name: 'Save as preset' }).click();
  await page.waitForTimeout(200);
  const nameInput = page.getByPlaceholder('Preset name…');
  await nameInput.fill('Test scheme');
  await nameInput.press('Enter');
  await page.waitForTimeout(400);

  const chipVisible = await page.getByText('Test scheme').isVisible();
  console.log(`   "Test scheme" chip visible: ${chipVisible}`);

  // Verify there are color swatches in the chip
  const chipContainer = page.locator('div.group', { hasText: 'Test scheme' });
  const swatchCount = await chipContainer.locator('.rounded-full.w-3\\.5').count();
  console.log(`   swatches in chip: ${swatchCount}`);

  await page.screenshot({ path: '/tmp/preset-swatches.png', fullPage: false });

  console.log('5. Clean up');
  await page.evaluate(() => localStorage.removeItem('habaneta:presets'));

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/preset-swatches-error.png', fullPage: true });
} finally {
  await browser.close();
}
