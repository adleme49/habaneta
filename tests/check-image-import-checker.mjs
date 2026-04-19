// Reproduces the user's "azulejo damas" case: a yellow/cream checkerboard.
// Verifies (a) auto-levels preserves hue and (b) edges don't wander badly.

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

  // 4x4 yellow/cream checkerboard, slight JPEG-like noise and a gentle
  // lighting gradient — matches the failing user screenshot.
  const testImagePath = join(tmpdir(), 'habaneta-checker-tile.png');
  const dataUrl = await page.evaluate(() => {
    const N = 400, CELLS = 4;
    const canvas = document.createElement('canvas');
    canvas.width = N; canvas.height = N;
    const ctx = canvas.getContext('2d');
    const C = N / CELLS;
    const yellow = '#e8b330';
    const cream = '#f0ead8';
    for (let r = 0; r < CELLS; r++) {
      for (let c = 0; c < CELLS; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? yellow : cream;
        ctx.fillRect(c * C, r * C, C, C);
      }
    }
    // Subtle noise + light gradient
    const img = ctx.getImageData(0, 0, N, N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = (y * N + x) * 4;
        const n = (Math.random() - 0.5) * 20;
        const grad = ((x + y) / (2 * N) - 0.5) * 15;
        for (let k = 0; k < 3; k++) {
          img.data[i + k] = Math.max(0, Math.min(255, img.data[i + k] + n + grad));
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  async function runWith(layers, autoLev, shot) {
    await page.getByRole('button', { name: 'Import image' }).click();
    await page.waitForTimeout(200);
    await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
    await page.waitForTimeout(200);
    await page.locator('input[type="range"]').fill(String(layers));
    const levelsBox = page.locator('label:has-text("Auto-balance") input[type="checkbox"]');
    if ((await levelsBox.isChecked()) !== autoLev) await levelsBox.click();
    await page.waitForTimeout(1500); // let live preview settle
    const swatches = await page.locator('span[title^="#"]').evaluateAll(
      (els) => els.map((e) => e.getAttribute('title'))
    );
    const paths = await page.evaluate(() => {
      const svg = document.querySelector('[role="dialog"] svg');
      return svg ? svg.querySelectorAll('path').length : -1;
    });
    await page.getByRole('dialog').screenshot({ path: shot });
    await page.getByRole('button', { name: /Cancel/ }).click();
    await page.waitForTimeout(200);
    return { swatches, paths };
  }

  const r2on = await runWith(2, true, '/tmp/checker-2-levels-on.png');
  console.log('k=2 auto-levels ON :', r2on);
  const r5on = await runWith(5, true, '/tmp/checker-5-levels-on.png');
  console.log('k=5 auto-levels ON :', r5on);
  const r2off = await runWith(2, false, '/tmp/checker-2-levels-off.png');
  console.log('k=2 auto-levels OFF:', r2off);

  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/checker-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
