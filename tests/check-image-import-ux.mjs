// Verify Tier 4 UX: debounced live preview (no Analyze click needed)
// and the similar-colors hint when layerCount is too high.

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

try {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Two-color tile, sharp edges (no antialiased intermediates). Asking for
  // many layers should produce near-duplicate centroids and trigger the
  // similar-colors hint.
  const testImagePath = join(tmpdir(), 'habaneta-ux-tile.png');
  const dataUrl = await page.evaluate(() => {
    const N = 400;
    const canvas = document.createElement('canvas');
    canvas.width = N; canvas.height = N;
    const ctx = canvas.getContext('2d');
    // Left half cream, right half blue. fillRect is pixel-sharp.
    ctx.fillStyle = '#f0e6cc'; ctx.fillRect(0, 0, N / 2, N);
    ctx.fillStyle = '#2b4f6b'; ctx.fillRect(N / 2, 0, N / 2, N);
    return canvas.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  console.log('1. Open dialog + upload (no Analyze click)');
  await page.getByRole('button', { name: 'Import image' }).click();
  await page.waitForTimeout(200);
  await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
  // Do NOT click Analyze — the debounced effect should run it.
  await page.waitForSelector('span[title^="#"]', { timeout: 5000 });
  const autoRanSwatches = await page.locator('span[title^="#"]').count();
  console.log(`   auto-analyze ran: ${autoRanSwatches} swatches visible`);
  if (autoRanSwatches < 2) throw new Error('debounced live preview did not run');

  console.log('2. Bump layers to 8 — expect similar-colors hint');
  await page.locator('input[type="range"]').fill('8');
  // Wait for debounced re-run.
  await page.waitForTimeout(1500);
  const swatchesAt8 = await page.locator('span[title^="#"]').evaluateAll(
    (els) => els.map((e) => e.getAttribute('title'))
  );
  console.log(`   swatches: ${swatchesAt8.length}`, swatchesAt8);
  const hintVisible = await page.getByText(/try fewer layers/i).isVisible();
  console.log(`   similar-colors hint visible: ${hintVisible}`);
  if (!hintVisible) throw new Error('similar-colors hint not shown for over-clustered 2-color tile');

  console.log('3. Drop layers back to 2 — hint disappears');
  await page.locator('input[type="range"]').fill('2');
  await page.waitForTimeout(1500);
  const hintGone = !(await page.getByText(/try fewer layers/i).isVisible().catch(() => false));
  console.log(`   hint gone: ${hintGone}`);

  await page.getByRole('dialog').screenshot({ path: '/tmp/image-import-ux.png' });
  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/image-import-ux-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
