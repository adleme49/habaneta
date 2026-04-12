// End-to-end: the Export button rasterizes the grid and triggers a
// PNG download. We don't inspect the pixel payload — we only verify
// that the browser's download event fires, the filename looks right,
// and the file has non-zero size. That's enough to catch "button
// wiring broke" or "dom-to-image choked on a new SVG shape".

import { chromium } from 'playwright';
import { readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// PNG dimensions live in the IHDR chunk at bytes 16-23 of the file
// (big-endian u32 width followed by u32 height). Reading them is a
// sharper signal than file size because PNG compression of a
// repeated floor pattern is highly non-linear.
function pngDimensions(buf) {
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

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
  const smallDims = pngDimensions(header);
  console.log(`   dimensions: ${smallDims.width} x ${smallDims.height}`);

  console.log('3. After success, UI shows "Design exported"');
  const ok = await page
    .getByText('Design exported')
    .isVisible()
    .catch(() => false);
  console.log(`   success status visible: ${ok}`);

  console.log('4. Bump grid to 12 rows (exceeds old cap, uses virtualizer)');
  for (let i = 0; i < 9; i++) {
    await page.getByLabel('More rows').click();
  }
  await page.waitForTimeout(400);
  const bigRows = await page.locator('span.tabular-nums').textContent();
  console.log(`   counter: "${bigRows}"`);
  if (bigRows !== '12') {
    throw new Error(`expected 12 rows, got ${bigRows}`);
  }

  // Prove the virtualizer is actually windowing rows. At 12 body
  // rows there are 14 logical rows total (top border + 12 + bottom
  // border). In the 900px viewport we should see substantially
  // fewer than 14 rendered — closer to 5-8 once the virtualizer
  // settles.
  const renderedRows = await page.locator('[data-row-kind]').count();
  console.log(`   [data-row-kind] rows in DOM: ${renderedRows}`);
  if (renderedRows >= 14) {
    throw new Error(
      `virtualizer is not windowing rows — rendered ${renderedRows} of 14 (expected < 14)`
    );
  }
  if (renderedRows < 2) {
    throw new Error(
      `virtualizer rendered too few rows (${renderedRows}) — something is off`
    );
  }

  console.log('5. Export a large grid → PNG must include all rows');
  const download2Promise = page.waitForEvent('download', { timeout: 15000 });
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const download2 = await download2Promise;
  const savePath2 = join(tmpdir(), download2.suggestedFilename());
  await download2.saveAs(savePath2);
  const st2 = await stat(savePath2);
  console.log(`   saved to ${savePath2} (${st2.size} bytes)`);
  const header2 = await readFile(savePath2);
  if (
    header2[0] !== 0x89 ||
    header2[1] !== 0x50 ||
    header2[2] !== 0x4e ||
    header2[3] !== 0x47
  ) {
    throw new Error('large-grid file is not a PNG');
  }
  const bigDims = pngDimensions(header2);
  console.log(`   dimensions: ${bigDims.width} x ${bigDims.height}`);
  // The 12-row export must be substantially taller than the 3-row
  // export — capturing only the viewport (the pre-fix bug) would
  // give nearly identical heights. Assert at least 2x vertical
  // growth to prove the unvirtualize-for-export path captured all
  // rows.
  if (bigDims.height < smallDims.height * 2) {
    throw new Error(
      `large-grid export height ${bigDims.height}px is not ≥ 2x small-grid ${smallDims.height}px — virtualize-off path probably broken`
    );
  }

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/export-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
