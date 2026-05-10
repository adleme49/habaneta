import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));

try {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('1. Click Contemporary (74 tiles)');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(800);

  // Count how many TileItem elements are actually in the DOM.
  // The virtualizer should render only ~visible + overscan items, not all 74.
  const mounted = await page.locator('.svg-wrapper').count();
  console.log(`   SVG wrappers mounted: ${mounted} (out of 74 tiles)`);

  if (mounted >= 74) {
    console.log('   ✗ virtualizer not working — all tiles rendered');
  } else {
    console.log('   ✓ virtualizer working — only visible tiles rendered');
  }

  console.log('2. Scroll the selector halfway');
  const selector = page.locator('[style*="contain"]').first();
  await selector.evaluate((el) => {
    el.scrollTop = el.scrollHeight / 2;
  });
  await page.waitForTimeout(400);

  const mountedAfterScroll = await page.locator('.svg-wrapper').count();
  console.log(`   SVG wrappers mounted after scroll: ${mountedAfterScroll}`);

  console.log('3. Pick a tile at current scroll position');
  await page.locator('.svg-wrapper').nth(1).click();
  await page.waitForTimeout(300);

  // Editor should show a tile now
  const editorHasTile = await page
    .getByText('Save to recents')
    .isVisible();
  console.log(`   Editor ready after click: ${editorHasTile}`);

  await page.screenshot({ path: '/tmp/virtual-scrolled.png', fullPage: true });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
} finally {
  await browser.close();
}
