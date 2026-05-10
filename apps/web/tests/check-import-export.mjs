import { chromium } from 'playwright';

const browser = await chromium.launch({ downloadsPath: '/tmp' });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true,
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Clean state
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('1. Export button should be disabled with 0 user tiles');
  const exportDisabled = await page
    .getByRole('button', { name: 'Export' })
    .isDisabled();
  console.log(`   disabled: ${exportDisabled}`);

  console.log('2. Seed a user tile via IndexedDB');
  await page.evaluate(async () => {
    const { set } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await set('habaneta:user-tiles', [
      {
        id: 'user/roundtrip-1',
        kind: 'floor',
        family: 'Roundtrip',
        displayName: 'Roundtrip Tile',
        svgUrl: '/assets/Tile/Contemporary/l05.svg',
        layers: { st0: '#abcdef', st1: '#123456' },
        source: 'user',
      },
    ]);
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('3. Click Export and capture the download');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export' }).click(),
  ]);
  const downloadPath = await download.path();
  console.log(`   Downloaded to: ${downloadPath}`);

  // Verify the status message
  const exportStatus = await page.getByText(/Exported \d+ tile/).textContent();
  console.log(`   Status: "${exportStatus}"`);

  console.log('4. Wipe the IDB store, then Import the downloaded file');
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const rowsBefore = await page.locator('tbody tr').count();
  console.log(`   Rows after wipe: ${rowsBefore}`);

  console.log('5. Click Import → pick the exported file');
  // The file input is hidden; setInputFiles works directly.
  await page.setInputFiles('input[type="file"][accept*="json"]', downloadPath);
  await page.waitForTimeout(500);

  const importStatus = await page.getByText(/Imported 1/).textContent();
  console.log(`   Status: "${importStatus}"`);

  const rowsAfter = await page.locator('tbody tr').count();
  console.log(`   Rows after import: ${rowsAfter}`);
  const restored = await page.getByText('Roundtrip Tile').isVisible();
  console.log(`   "Roundtrip Tile" restored: ${restored}`);

  console.log('6. Re-import same file → should skip (dedupe)');
  await page.setInputFiles('input[type="file"][accept*="json"]', downloadPath);
  await page.waitForTimeout(500);
  const secondImport = await page.getByText(/Imported 0, skipped 1/).textContent();
  console.log(`   Status: "${secondImport}"`);

  await page.screenshot({ path: '/tmp/import-export.png', fullPage: true });

  // Clean up
  await page.evaluate(async () => {
    const { del } = await import('/node_modules/.vite/deps/idb-keyval.js');
    await del('habaneta:user-tiles');
  });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/import-export-error.png', fullPage: true });
} finally {
  await browser.close();
}
