import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

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

  // Clean slate — remove any user tiles from a previous run.
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const builtinRows = await page.locator('tbody tr').count();
  console.log(`1. Builtin rows: ${builtinRows}`);

  console.log('2. Click "Upload tile"');
  await page.getByRole('button', { name: 'Upload tile' }).click();
  await page.waitForTimeout(300);

  // Pick a real builtin SVG and feed it to the file input.
  // public/assets/Tile/Contemporary/l05.svg has stN layers so the parser
  // should accept it and we re-use it as the test fixture.
  console.log('3. Upload a real SVG from public/assets');
  await page.setInputFiles('#svgfile', './public/assets/Tile/Contemporary/l05.svg');
  await page.waitForTimeout(400);

  // Detected layer count should be > 0
  const layerText = await page.locator('text=/\\d+ layers detected/').textContent();
  console.log(`   ${layerText}`);

  console.log('4. Fill form + submit');
  await page.getByLabel('Name').fill('Test Upload');
  await page.getByLabel('Family').fill('Uploads');
  // kind defaults to 'floor'
  await page.getByRole('button', { name: 'Save tile' }).click();
  await page.waitForTimeout(600);

  const afterUploadRows = await page.locator('tbody tr').count();
  console.log(`5. Rows after upload: ${afterUploadRows}`);
  console.log(`   Expected: ${builtinRows + 1}`);

  const uploadVisible = await page.getByText('Test Upload').isVisible();
  console.log(`   "Test Upload" visible: ${uploadVisible}`);

  // Check the library query invalidation worked — the new tile should
  // also be visible back on the editor page in the browser panel.
  console.log('6. Navigate back to editor');
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}/home`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const newFamilyInEditor = await page.getByText(/^Uploads/).isVisible();
  console.log(`   "Uploads" family in editor browser: ${newFamilyInEditor}`);

  await page.screenshot({ path: '/tmp/upload-editor.png', fullPage: true });

  console.log('7. Back to library, delete the uploaded tile');
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}/library`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Click the Delete button on the user-tile row, then Confirm
  const row = page.locator('tbody tr', { hasText: 'Test Upload' });
  await row.getByRole('button', { name: 'Delete' }).click();
  await page.waitForTimeout(200);
  await row.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForTimeout(500);

  const afterDeleteRows = await page.locator('tbody tr').count();
  console.log(`   Rows after delete: ${afterDeleteRows}`);
  const stillVisible = await page.getByText('Test Upload').isVisible().catch(() => false);
  console.log(`   "Test Upload" still visible: ${stillVisible}`);

  // Clean up just in case
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/upload-error.png', fullPage: true });
} finally {
  await browser.close();
}
