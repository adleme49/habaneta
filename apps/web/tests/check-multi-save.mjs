import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', err => errors.push(err.message));

try {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('1. Click Contemporary (floor category)');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);

  console.log('2. Click first floor tile');
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);

  console.log('3. Save floor to recent');
  await page.getByText('Save to recents').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/multi-1-after-floor.png', fullPage: true });

  console.log('4. Click Victorian (border category)');
  await page.getByText(/^Victorian/).click();
  await page.waitForTimeout(300);

  console.log('5. Click first border tile');
  // Find border tile in the selector — browser panel SVGs
  const browserTiles = page.locator('div').filter({ has: page.locator('.svg-wrapper') });
  await page.locator('.svg-wrapper').nth(1).click(); // 0 is the floor in editor, 1+ are in the selector
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/multi-2-border-picked.png', fullPage: true });

  const saveButtonText = await page.locator('button', { hasText: /Save to recents|Already/ }).textContent();
  console.log(`   Save button says: "${saveButtonText}"`);

  console.log('6. Save border to recent');
  await page.getByText('Save to recents').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/multi-3-after-border.png', fullPage: true });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach(e => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FLOW FAILED:', e.message);
  await page.screenshot({ path: '/tmp/multi-error.png', fullPage: true });
} finally {
  await browser.close();
}
