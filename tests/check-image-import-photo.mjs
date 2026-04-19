// Closer to a real azulejo photograph: checkerboard with grout lines,
// within-tile glaze variation, and strong noise. Verifies that the
// new stronger smoothing (pre-blur + 3-pass majority + small-component
// filter + bigger DP epsilon) produces near-perfect rectangles.

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

  const testImagePath = join(tmpdir(), 'habaneta-photo-tile.png');
  const dataUrl = await page.evaluate(() => {
    const N = 400, CELLS = 4;
    const canvas = document.createElement('canvas');
    canvas.width = N; canvas.height = N;
    const ctx = canvas.getContext('2d');
    const C = N / CELLS;

    // Subtle grout background.
    ctx.fillStyle = '#d4cfc0';
    ctx.fillRect(0, 0, N, N);

    // Slightly-inset tiles with mild per-tile glaze jitter.
    const GROUT = 2;
    for (let r = 0; r < CELLS; r++) {
      for (let c = 0; c < CELLS; c++) {
        const baseYellow = (r + c) % 2 === 0;
        const baseR = baseYellow ? 232 : 240;
        const baseG = baseYellow ? 179 : 234;
        const baseB = baseYellow ? 48  : 216;
        const jitter = () => Math.floor((Math.random() - 0.5) * 8);
        ctx.fillStyle = `rgb(${baseR+jitter()}, ${baseG+jitter()}, ${baseB+jitter()})`;
        ctx.fillRect(c * C + GROUT, r * C + GROUT, C - 2*GROUT, C - 2*GROUT);
      }
    }

    // Photographic noise + slight lighting gradient across the whole image.
    // Stay well below the inter-color gap so 2 clusters remain separable.
    const img = ctx.getImageData(0, 0, N, N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = (y * N + x) * 4;
        const n = (Math.random() - 0.5) * 14;
        const g = ((x + y) / (2 * N) - 0.5) * 12;
        for (let k = 0; k < 3; k++) {
          img.data[i + k] = Math.max(0, Math.min(255, img.data[i + k] + n + g));
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  await page.getByRole('button', { name: 'Import image' }).click();
  await page.waitForTimeout(200);
  await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
  await page.waitForTimeout(200);
  await page.locator('input[type="range"]').fill('2');
  await page.waitForTimeout(1800);
  const swatches = await page.locator('span[title^="#"]').evaluateAll(
    (els) => els.map((e) => e.getAttribute('title'))
  );
  const paths = await page.evaluate(() => {
    const svg = document.querySelector('[role="dialog"] svg');
    return svg ? svg.querySelectorAll('path').length : -1;
  });
  console.log('swatches:', swatches, 'paths:', paths);
  await page.getByRole('dialog').screenshot({ path: '/tmp/photo-tile.png' });
  console.log('screenshot → /tmp/photo-tile.png');

  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/photo-tile-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
