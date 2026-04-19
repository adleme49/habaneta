// Visual quality check for the image-import pipeline. Generates a
// synthetic tile-like PNG (concentric shapes + noise) and renders the
// import dialog's before/after preview so we can eyeball the result.

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

  // Make a synthetic "tile-like" image: 4 colors in concentric rings + noise.
  const testImagePath = join(tmpdir(), 'habaneta-quality-tile.png');
  const dataUrl = await page.evaluate(() => {
    const N = 400;
    const canvas = document.createElement('canvas');
    canvas.width = N; canvas.height = N;
    const ctx = canvas.getContext('2d');
    // Background
    ctx.fillStyle = '#f2ead6'; ctx.fillRect(0, 0, N, N);
    // Outer ring
    ctx.fillStyle = '#2b4f6b'; ctx.beginPath();
    ctx.arc(N/2, N/2, N*0.47, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f2ead6'; ctx.beginPath();
    ctx.arc(N/2, N/2, N*0.40, 0, Math.PI*2); ctx.fill();
    // Middle accent
    ctx.fillStyle = '#c64a3a'; ctx.beginPath();
    ctx.arc(N/2, N/2, N*0.28, 0, Math.PI*2); ctx.fill();
    // Center
    ctx.fillStyle = '#e8b43c'; ctx.beginPath();
    ctx.arc(N/2, N/2, N*0.14, 0, Math.PI*2); ctx.fill();
    // Cross arms
    ctx.fillStyle = '#2b4f6b';
    ctx.fillRect(N*0.47, 0, N*0.06, N);
    ctx.fillRect(0, N*0.47, N, N*0.06);
    // Sprinkle photographic noise
    const img = ctx.getImageData(0,0,N,N);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 30;
      img.data[i]   = Math.max(0, Math.min(255, img.data[i]   + n));
      img.data[i+1] = Math.max(0, Math.min(255, img.data[i+1] + n));
      img.data[i+2] = Math.max(0, Math.min(255, img.data[i+2] + n));
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  console.log('Open import dialog + upload');
  await page.getByRole('button', { name: 'Import image' }).click();
  await page.waitForTimeout(300);
  await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
  await page.waitForTimeout(300);

  console.log('Analyze with 4 layers');
  await page.locator('input[type="range"]').fill('4');
  await page.getByRole('button', { name: /Analyze/ }).click();
  await page.waitForSelector('span[title^="#"]', { timeout: 15000 });

  const swatches = await page.locator('span[title^="#"]').evaluateAll(
    (els) => els.map((e) => e.getAttribute('title'))
  );
  console.log('swatches:', swatches);

  // Dialog region screenshot.
  const dialog = page.getByRole('dialog');
  await dialog.screenshot({ path: '/tmp/image-import-quality.png' });
  console.log('screenshot → /tmp/image-import-quality.png');

  // Extract result SVG shape summary.
  const shape = await page.evaluate(() => {
    const svg = document.querySelector('[role="dialog"] svg');
    if (!svg) return null;
    return {
      paths: svg.querySelectorAll('path').length,
      rects: svg.querySelectorAll('rect').length,
    };
  });
  console.log('result SVG:', shape);

  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0,200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/image-import-quality-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
