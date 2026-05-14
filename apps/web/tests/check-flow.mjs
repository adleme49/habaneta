import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  console.log('Step 1: Click "Contemporary" category');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/flow-1.png', fullPage: true });

  console.log('Step 2: Click first tile in selector');
  const tileItems = await page.locator('[class*="cursor-pointer"]').all();
  console.log(`  Found ${tileItems.length} clickable items`);
  // Find a tile item (should have an SVG)
  const svgTile = page.locator('.svg-wrapper').first();
  await svgTile.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/flow-2.png', fullPage: true });

  console.log('Step 3: Click "Save to recents"');
  await page.getByText('Save to recents').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/flow-3.png', fullPage: true });

  console.log(`\nErrors during flow: ${errors.length}`);
  errors.forEach(e => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FLOW FAILED:', e.message);
  await page.screenshot({ path: '/tmp/flow-error.png', fullPage: true });
} finally {
  await browser.close();
}
