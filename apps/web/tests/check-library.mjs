import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('1. Click "Library →" in nav');
  await page.getByRole('link', { name: /Library/ }).click();
  await page.waitForURL('**/library');
  await page.waitForTimeout(500);

  // Row count should equal the 91 tiles in the catalog.
  const rows = await page.locator('tbody tr').count();
  console.log(`   Rows in table: ${rows}`);

  // The counter in the top-right should show "91 / 91" initially.
  const counter = await page.locator('text=/91 \\/ 91/').first().textContent();
  console.log(`   Counter: "${counter}"`);

  console.log('2. Filter by "victorian"');
  await page.getByPlaceholder(/Search tiles/).fill('victorian');
  await page.waitForTimeout(400);
  const filtered = await page.locator('tbody tr').count();
  console.log(`   Rows after filter: ${filtered}`);

  console.log('3. Sort by Name');
  await page.getByRole('button', { name: /^Name/ }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /^Name/ }).click(); // toggle desc
  await page.waitForTimeout(200);

  console.log('4. Clear filter');
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.waitForTimeout(300);
  const afterClear = await page.locator('tbody tr').count();
  console.log(`   Rows after clear: ${afterClear}`);

  console.log('5. Click "Floors" pill');
  await page.getByRole('button', { name: /^Floors/ }).click();
  await page.waitForTimeout(300);
  const floorRows = await page.locator('tbody tr').count();
  console.log(`   Floor rows: ${floorRows}`);

  console.log('6. Click "Borders" pill');
  await page.getByRole('button', { name: /^Borders/ }).click();
  await page.waitForTimeout(300);
  const borderRows = await page.locator('tbody tr').count();
  console.log(`   Border rows: ${borderRows}`);

  console.log('7. Click "All" pill to reset');
  await page.getByRole('button', { name: /^All/ }).click();
  await page.waitForTimeout(300);
  const allRows = await page.locator('tbody tr').count();
  console.log(`   All rows: ${allRows}`);

  console.log('8. Back to editor');
  await page.getByRole('link', { name: /back to editor/ }).click();
  await page.waitForURL('**/home');
  await page.waitForTimeout(300);

  // No more section headers; confirm we landed back on the editor by
  // looking for one of the category labels in the browser column.
  const editorVisible = await page
    .getByText('TILES', { exact: true })
    .first()
    .isVisible();
  console.log(`   Back on editor: ${editorVisible}`);

  await page.screenshot({ path: '/tmp/library.png', fullPage: true });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/library-error.png', fullPage: true });
} finally {
  await browser.close();
}
