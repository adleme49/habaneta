// End-to-end: image import pipeline. Creates a test PNG in-memory,
// drops it into the import dialog, runs the analysis, and verifies
// the resulting tile is saved to the library.

import { chromium } from 'playwright';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Create a small test PNG with distinct color bands so k-means
// has real structure to find. We generate a 40×40 image where the
// top half is red and the bottom half is blue.
function createTestPng() {
  // Minimal PNG encoder — we only need RGBA pixels in a valid file.
  // This produces a valid but uncompressed deflate-stored PNG.
  const width = 40;
  const height = 40;

  // Build IDAT payload: each row = filter byte (0x00) + RGBA pixels.
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = [0x00]; // no filter
    for (let x = 0; x < width; x++) {
      if (y < height / 2) {
        row.push(220, 40, 40, 255); // red
      } else {
        row.push(40, 40, 220, 255); // blue
      }
    }
    rawRows.push(...row);
  }

  // We'll use a canvas-based approach via Playwright instead.
  return { width, height };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Create a test image file via canvas in the browser, then download it.
  const testImagePath = join(tmpdir(), 'habaneta-test-tile.png');
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    // Four quadrants: red, green, blue, yellow
    ctx.fillStyle = '#dc2828';
    ctx.fillRect(0, 0, 50, 50);
    ctx.fillStyle = '#28dc28';
    ctx.fillRect(50, 0, 50, 50);
    ctx.fillStyle = '#2828dc';
    ctx.fillRect(0, 50, 50, 50);
    ctx.fillStyle = '#dcdc28';
    ctx.fillRect(50, 50, 50, 50);
    return canvas.toDataURL('image/png');
  });

  // Convert data URL to file on disk for the file input.
  const base64 = dataUrl.split(',')[1];
  writeFileSync(testImagePath, Buffer.from(base64, 'base64'));

  console.log('1. Open "Import image" dialog');
  await page.getByRole('button', { name: 'Import image' }).click();
  await page.waitForTimeout(300);

  const dialogVisible = await page.getByText('Import tile from image').isVisible();
  console.log(`   dialog visible: ${dialogVisible}`);
  if (!dialogVisible) throw new Error('import dialog did not open');

  console.log('2. Upload the test image');
  const fileInput = page.locator('input[type="file"][accept*="image/png"]');
  await fileInput.setInputFiles(testImagePath);
  await page.waitForTimeout(300);

  // Original preview should appear.
  const originalImg = page.locator('img[alt="Original"]');
  const originalVisible = await originalImg.isVisible();
  console.log(`   original preview visible: ${originalVisible}`);

  console.log('3. Set layers to 4 and analyze');
  await page.locator('input[type="range"]').fill('4');
  await page.waitForTimeout(100);
  await page.getByRole('button', { name: /Analyze/ }).click();
  await page.waitForTimeout(1500); // give k-means time

  // Check layers were detected.
  const layerText = await page.getByText(/layers detected/).textContent();
  console.log(`   ${layerText}`);

  // Swatches should be visible.
  const swatchCount = await page.locator('span[title^="#"]').count();
  console.log(`   color swatches: ${swatchCount}`);
  if (swatchCount < 2) throw new Error(`expected ≥2 swatches, got ${swatchCount}`);

  console.log('4. Fill name and save');
  const nameInput = page.getByPlaceholder(/Floral pattern/);
  await nameInput.fill('Test Import Tile');
  await page.waitForTimeout(100);
  await page.getByRole('button', { name: /Save tile/ }).click();
  await page.waitForTimeout(500);

  // Dialog should close.
  const dialogGone = !(await page.getByText('Import tile from image').isVisible().catch(() => false));
  console.log(`   dialog closed: ${dialogGone}`);

  console.log('5. Verify tile appears in the library table');
  await page.waitForTimeout(300);
  const tileInTable = await page.getByText('Test Import Tile').isVisible();
  console.log(`   "Test Import Tile" in table: ${tileInTable}`);
  if (!tileInTable) throw new Error('imported tile not found in library table');

  // Clean up: delete the test tile.
  // Find the row with our tile and click delete.
  console.log('6. Clean up: delete test tile');
  const deleteBtn = page.locator('tr', { hasText: 'Test Import Tile' }).getByText('Delete');
  if (await deleteBtn.count()) {
    await deleteBtn.click();
    await page.waitForTimeout(200);
    await page.getByText('Confirm').click();
    await page.waitForTimeout(300);
  }

  // Clean up temp file.
  try { unlinkSync(testImagePath); } catch {}

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/image-import-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
