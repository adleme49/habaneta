import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('1. Press "/" to focus search');
  await page.keyboard.press('/');
  await page.waitForTimeout(100);
  const focusedPlaceholder = await page.evaluate(
    () => document.activeElement?.getAttribute('placeholder') ?? ''
  );
  console.log(`   focused input placeholder: "${focusedPlaceholder}"`);

  console.log('2. Type to narrow, then find a specific tile row');
  await page.keyboard.type('l05');
  await page.waitForTimeout(400);
  const filtered = await page.locator('tbody tr').count();
  console.log(`   filtered rows: ${filtered}`);

  console.log('3. Click the first matching row → opens detail drawer');
  const firstRow = page.locator('tbody tr').first();
  const tileName = await firstRow.locator('td').nth(1).textContent();
  console.log(`   clicking "${tileName}"`);
  await firstRow.click();
  await page.waitForTimeout(400);

  // Detail drawer should be open with "Open in editor"
  const drawerOpen = await page
    .getByRole('button', { name: 'Open in editor' })
    .isVisible();
  console.log(`   drawer visible with Open in editor button: ${drawerOpen}`);

  console.log('4. Click "Open in editor" → navigate to /home?tile=');
  await page.getByRole('button', { name: 'Open in editor' }).click();
  await page.waitForURL('**/home**');
  await page.waitForTimeout(400);

  const url = page.url();
  console.log(`   URL: ${url}`);

  // Editor should have the tile loaded — "Save to recents" button visible
  const editorLoaded = await page.getByText('Save to recents').isVisible();
  console.log(`   Editor ready with tile: ${editorLoaded}`);

  // The family in the browser panel should be highlighted
  const contemporaryActive = await page
    .locator('li', { hasText: /^Contemporary/ })
    .first()
    .getAttribute('class');
  console.log(`   Contemporary li class includes active state: ${contemporaryActive?.includes('bg-blue-50') ?? false}`);

  await page.screenshot({ path: '/tmp/library-nav.png', fullPage: true });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/library-nav-error.png', fullPage: true });
} finally {
  await browser.close();
}
