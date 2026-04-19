// Verify that enforcing 4-fold symmetry denoises a photo-like input.

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

  // Synthetic 4-fold symmetric "tile photo": identical motif in every
  // quadrant, plus strong noise + a lighting gradient to make it look
  // like a real photograph. Symmetry averaging should cancel both.
  const testImagePath = join(tmpdir(), 'habaneta-symmetry-tile.png');
  const dataUrl = await page.evaluate(() => {
    const N = 400;
    const canvas = document.createElement('canvas');
    canvas.width = N; canvas.height = N;
    const ctx = canvas.getContext('2d');
    // Cream background
    ctx.fillStyle = '#efe4c9'; ctx.fillRect(0, 0, N, N);
    // Draw a motif once, then reflect to 4 quadrants — creates D4.
    const M = N / 2;
    // Quadrant diagonal arm
    ctx.fillStyle = '#a4382c'; ctx.fillRect(M - 20, 0, 40, M);
    ctx.fillStyle = '#3a5a78'; ctx.beginPath();
    ctx.arc(M, M, N * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#efe4c9'; ctx.beginPath();
    ctx.arc(M, M, N * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d9a43c'; ctx.beginPath();
    ctx.arc(M, M, N * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a4382c'; ctx.fillRect(0, M - 20, N, 40);

    // Apply heavy noise + a diagonal light gradient (simulates photo).
    const img = ctx.getImageData(0, 0, N, N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = (y * N + x) * 4;
        const n = (Math.random() - 0.5) * 50;
        const grad = ((x + y) / (2 * N) - 0.5) * 40; // ±20 brightness
        for (let k = 0; k < 3; k++) {
          const v = img.data[i + k] + n + grad;
          img.data[i + k] = Math.max(0, Math.min(255, v));
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  async function runWith(symmetryValue, screenshotName) {
    // Open dialog
    await page.getByRole('button', { name: 'Import image' }).click();
    await page.waitForTimeout(200);
    await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
    await page.waitForTimeout(200);
    await page.locator('input[type="range"]').fill('4');
    await page.locator('#image-import-symmetry').selectOption(symmetryValue);
    await page.getByRole('button', { name: /Analyze/ }).click();
    await page.waitForSelector('span[title^="#"]', { timeout: 15000 });
    const swatches = await page.locator('span[title^="#"]').evaluateAll(
      (els) => els.map((e) => e.getAttribute('title'))
    );
    const rectCount = await page.evaluate(() => {
      const svg = document.querySelector('[role="dialog"] svg');
      return svg ? svg.querySelectorAll('rect').length : -1;
    });
    const dialog = page.getByRole('dialog');
    await dialog.screenshot({ path: screenshotName });
    // Cancel so we can reopen clean.
    await page.getByRole('button', { name: /Cancel/ }).click();
    await page.waitForTimeout(200);
    return { swatches, rectCount };
  }

  const noSym = await runWith('none', '/tmp/image-import-sym-none.png');
  console.log('symmetry=none  swatches:', noSym.swatches, 'rects:', noSym.rectCount);

  const fourFold = await runWith('4fold', '/tmp/image-import-sym-4fold.png');
  console.log('symmetry=4fold swatches:', fourFold.swatches, 'rects:', fourFold.rectCount);

  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/image-import-symmetry-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
