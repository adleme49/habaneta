// Verify autoCrop trims uniform borders and autoLevels corrects
// a blue color cast + crushed dynamic range.

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

  // Synthesize a photo: tile design in the center, thick uniform
  // "grout" border, blue color cast, and compressed contrast.
  const testImagePath = join(tmpdir(), 'habaneta-preprocess.png');
  const dataUrl = await page.evaluate(() => {
    const N = 400, B = 60; // N = canvas, B = border width
    const canvas = document.createElement('canvas');
    canvas.width = N; canvas.height = N;
    const ctx = canvas.getContext('2d');
    // Uniform gray border (grout)
    ctx.fillStyle = '#cccccc'; ctx.fillRect(0, 0, N, N);
    // Inner tile region
    const I = N - 2 * B;
    ctx.fillStyle = '#efe4c9'; ctx.fillRect(B, B, I, I);
    ctx.fillStyle = '#a4382c';
    ctx.fillRect(B + I * 0.45, B, I * 0.1, I);
    ctx.fillRect(B, B + I * 0.45, I, I * 0.1);
    ctx.fillStyle = '#3a5a78'; ctx.beginPath();
    ctx.arc(N / 2, N / 2, I * 0.35, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#efe4c9'; ctx.beginPath();
    ctx.arc(N / 2, N / 2, I * 0.25, 0, Math.PI * 2); ctx.fill();

    // Compress contrast to [60,200] and add blue cast.
    const img = ctx.getImageData(0, 0, N, N);
    for (let i = 0; i < img.data.length; i += 4) {
      for (let k = 0; k < 3; k++) {
        img.data[i + k] = 60 + Math.round((img.data[i + k] / 255) * 140);
      }
      img.data[i + 2] = Math.min(255, img.data[i + 2] + 25); // blue cast
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  async function runWith(autoCropOn, autoLevelsOn, shotPath) {
    await page.getByRole('button', { name: 'Import image' }).click();
    await page.waitForTimeout(200);
    await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
    await page.waitForTimeout(200);
    await page.locator('input[type="range"]').fill('4');
    // toggle checkboxes to desired state
    const cropBox = page.locator('label:has-text("Auto-crop") input[type="checkbox"]');
    if ((await cropBox.isChecked()) !== autoCropOn) await cropBox.click();
    const levelsBox = page.locator('label:has-text("Auto-balance") input[type="checkbox"]');
    if ((await levelsBox.isChecked()) !== autoLevelsOn) await levelsBox.click();

    await page.getByRole('button', { name: /Analyze/ }).click();
    await page.waitForSelector('span[title^="#"]', { timeout: 15000 });
    const swatches = await page.locator('span[title^="#"]').evaluateAll(
      (els) => els.map((e) => e.getAttribute('title'))
    );
    const dialog = page.getByRole('dialog');
    await dialog.screenshot({ path: shotPath });
    await page.getByRole('button', { name: /Cancel/ }).click();
    await page.waitForTimeout(200);
    return swatches;
  }

  const raw = await runWith(false, false, '/tmp/image-import-pp-raw.png');
  console.log('raw:    ', raw);
  const both = await runWith(true, true, '/tmp/image-import-pp-both.png');
  console.log('crop+lv:', both);

  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/image-import-pp-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
