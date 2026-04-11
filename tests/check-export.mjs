// End-to-end: the Export button rasterizes the grid and triggers a
// PNG download. We don't inspect the pixel payload — we only verify
// that the browser's download event fires, the filename looks right,
// and the file has non-zero size. That's enough to catch "button
// wiring broke" or "dom-to-image choked on a new SVG shape".

import { chromium } from 'playwright';
import { readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browser = await chromium.launch();
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
  await page.goto('http://localhost:3000/home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('1. Pick a floor and save to recents');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);
  await page.getByText('Save to recents').click();
  await page.waitForTimeout(300);

  console.log('2. Click Export → wait for download');
  const downloadPromise = page.waitForEvent('download', { timeout: 8000 });
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const download = await downloadPromise;

  const suggested = download.suggestedFilename();
  console.log(`   suggested filename: ${suggested}`);
  if (!/^habaneta-design-\d{8}-\d{6}\.png$/.test(suggested)) {
    throw new Error(`unexpected filename shape: ${suggested}`);
  }

  const savePath = join(tmpdir(), suggested);
  await download.saveAs(savePath);
  const st = await stat(savePath);
  console.log(`   saved to ${savePath} (${st.size} bytes)`);
  if (st.size < 500) {
    throw new Error(`exported file is suspiciously small: ${st.size} bytes`);
  }

  // Sanity: PNG files start with the 8-byte signature 89 50 4E 47 0D 0A 1A 0A.
  const header = await readFile(savePath);
  const sig = Array.from(header.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
  console.log(`   header bytes: ${sig}`);
  if (
    header[0] !== 0x89 ||
    header[1] !== 0x50 ||
    header[2] !== 0x4e ||
    header[3] !== 0x47
  ) {
    throw new Error('file is not a PNG (bad magic bytes)');
  }

  console.log('3. After success, UI shows "Design exported"');
  const ok = await page
    .getByText('Design exported')
    .isVisible()
    .catch(() => false);
  console.log(`   success status visible: ${ok}`);

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/export-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
