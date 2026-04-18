// Verify the contour-traced SVG path output: same visual result,
// dramatically fewer SVG elements than the old rect mosaic.

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

  // Concentric rings + arms, like a real tile design.
  const testImagePath = join(tmpdir(), 'habaneta-paths-tile.png');
  const dataUrl = await page.evaluate(() => {
    const N = 400;
    const canvas = document.createElement('canvas');
    canvas.width = N; canvas.height = N;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f2ead6'; ctx.fillRect(0, 0, N, N);
    ctx.fillStyle = '#2b4f6b'; ctx.beginPath();
    ctx.arc(N/2, N/2, N*0.42, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f2ead6'; ctx.beginPath();
    ctx.arc(N/2, N/2, N*0.33, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#c64a3a'; ctx.beginPath();
    ctx.arc(N/2, N/2, N*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#2b4f6b';
    ctx.fillRect(N*0.48, 0, N*0.04, N);
    ctx.fillRect(0, N*0.48, N, N*0.04);
    return canvas.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  await page.getByRole('button', { name: 'Import image' }).click();
  await page.waitForTimeout(200);
  await page.locator('input[type="range"]').fill('3');
  await page.locator('#image-import-symmetry').selectOption('4fold');
  await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
  await page.waitForSelector('span[title^="#"]', { timeout: 15000 });
  // Wait for any late debounced re-run to settle.
  await page.waitForTimeout(1500);

  const counts = await page.evaluate(() => {
    const svg = document.querySelector('[role="dialog"] svg');
    if (!svg) return null;
    return {
      rects: svg.querySelectorAll('rect').length,
      paths: svg.querySelectorAll('path').length,
      bytes: svg.outerHTML.length,
    };
  });
  console.log('SVG stats:', counts);

  await page.getByRole('dialog').screenshot({ path: '/tmp/image-import-paths.png' });
  console.log('screenshot → /tmp/image-import-paths.png');

  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/image-import-paths-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
