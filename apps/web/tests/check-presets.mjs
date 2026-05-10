import { chromium } from 'playwright';

const browser = await chromium.launch();
// Use a dedicated context so localStorage doesn't bleed across runs.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Clear any leftover presets from previous runs.
  await page.evaluate(() => localStorage.removeItem('habaneta:presets'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('1. Pick a tile from Contemporary');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);

  // Preset panel should be visible with "No presets yet"
  const emptyText = await page.getByText(/No presets yet/).isVisible();
  console.log(`   Preset panel visible, empty: ${emptyText}`);

  console.log('2. Click "+ New preset" → name → Save in modal');
  await page.getByRole('button', { name: /New preset/ }).click();
  await page.waitForTimeout(300);
  const nameInput = page.locator('#preset-name-input');
  await nameInput.fill('Ocean blue');
  await page.getByRole('button', { name: /^Save$/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/presets-1-saved.png', fullPage: true });

  // Chip should appear
  const chipVisible = await page.getByText('Ocean blue').isVisible();
  console.log(`   "Ocean blue" chip visible: ${chipVisible}`);

  console.log('3. Reload page → preset should persist from localStorage');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // Re-select the same tile
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);

  const persistedVisible = await page.getByText('Ocean blue').isVisible();
  console.log(`   After reload, "Ocean blue" chip visible: ${persistedVisible}`);
  await page.screenshot({ path: '/tmp/presets-2-reloaded.png', fullPage: true });

  console.log('4. Delete the preset (hover reveals the × button)');
  const chip = page.locator('div').filter({ hasText: /^Ocean blue$/ }).first();
  await chip.hover();
  await page.waitForTimeout(200);
  await page.getByLabel('Delete Ocean blue').click();
  await page.waitForTimeout(300);
  const afterDelete = await page.getByText(/No presets yet/).isVisible();
  console.log(`   After delete, empty state shown: ${afterDelete}`);
  await page.screenshot({ path: '/tmp/presets-3-deleted.png', fullPage: true });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/presets-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
