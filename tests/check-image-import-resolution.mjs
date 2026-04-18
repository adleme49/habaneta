// Verify the resolution selector actually drives pipeline output.
// Runs the same test image at 256 and 2048, captures screenshots,
// and asserts the SVG's viewBox reflects the chosen resolution.

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

try {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const testImagePath = join(tmpdir(), 'habaneta-res-tile.png');
  const dataUrl = await page.evaluate(() => {
    const N = 600, CELLS = 4;
    const cv = document.createElement('canvas');
    cv.width = N; cv.height = N;
    const ctx = cv.getContext('2d');
    const C = N / CELLS;
    for (let r = 0; r < CELLS; r++) {
      for (let c = 0; c < CELLS; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#e8b330' : '#f0ead8';
        ctx.fillRect(c * C, r * C, C, C);
      }
    }
    return cv.toDataURL('image/png');
  });
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  async function runWith(pxChoice, shot) {
    await page.getByRole('button', { name: 'Import image' }).click();
    await page.waitForTimeout(200);
    await page.locator('input[type="file"][accept*="image/png"]').setInputFiles(testImagePath);
    await page.waitForTimeout(200);
    await page.locator('input[type="range"]').fill('2');
    await page.locator('#image-import-resolution').selectOption(String(pxChoice));
    // Wait for live preview to settle after resolution change.
    await page.waitForSelector('span[title^="#"]', { timeout: 20000 });
    await page.waitForTimeout(1200);
    const viewBox = await page.evaluate(() => {
      const svg = document.querySelector('[role="dialog"] svg');
      return svg ? svg.getAttribute('viewBox') : null;
    });
    const swatches = await page.locator('span[title^="#"]').evaluateAll(
      (els) => els.map((e) => e.getAttribute('title'))
    );
    await page.getByRole('dialog').screenshot({ path: shot });
    await page.getByRole('button', { name: /Cancel/ }).click();
    await page.waitForTimeout(200);
    return { viewBox, swatches };
  }

  const low = await runWith(256, '/tmp/res-256.png');
  console.log('256:', low);
  const high = await runWith(2048, '/tmp/res-2048.png');
  console.log('2048:', high);

  if (!low.viewBox?.endsWith('256 256')) throw new Error('256 viewBox not honored');
  if (!high.viewBox?.endsWith('2048 2048')) throw new Error('2048 viewBox not honored');
  console.log('\n✓ viewBox matches chosen resolution at both extremes');
  console.log('Errors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/res-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
