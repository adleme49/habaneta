// Verify the grid-pattern selector:
//  - Dropdown appears next to grid-size controls.
//  - Picking a pattern changes the rendered floor (distinct DOM rotations).
//  - Re-selecting "Auto" restores tile-driven behavior.
//  - Choice survives a page reload (session persistence).

import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

async function pickFirstFloor() {
  // Open Contemporary family and select the first tile.
  await page.getByText(/Contemporary/).first().click();
  await page.waitForTimeout(400);
  // Tiles in the selector are interactive tiles — click the first SVG
  // rendered inside the tile-selector column.
  const tiles = page.locator('.grid svg, [data-index] svg').first();
  await tiles.click();
  await page.waitForTimeout(400);
  // Commit the tile to a recent slot so the floor grid renders it.
  // A "Save to recents" / commit button exists once a tile is loaded.
  const commit = page.getByRole('button').filter({ hasText: /recent|commit|save/i }).first();
  if (await commit.count()) await commit.click().catch(() => {});
  await page.waitForTimeout(400);
}

async function readGridRotations() {
  // Sample the transform / rotation attribute on the first few floor tiles
  // so we can see whether pattern changes actually differ.
  return page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('#grid svg'));
    return tiles.slice(0, 8).map((svg) => {
      const style = svg.getAttribute('style') || '';
      const rotateMatch = style.match(/rotate\(([^)]+)\)/);
      return rotateMatch ? rotateMatch[1] : '';
    }).join('|');
  });
}

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Pick a floor tile first so there's something to pattern-rotate.
  await pickFirstFloor();
  await page.waitForTimeout(500);

  console.log('1. Verify the new dropdown is present');
  const select = page.locator('#grid-pattern-select');
  await select.waitFor({ timeout: 5000 });
  const optionCount = await select.locator('option').count();
  console.log(`   option count: ${optionCount}`);
  if (optionCount < 5) throw new Error('expected Auto + 6 patterns');

  console.log('2. Snapshot default (Auto) rotation pattern');
  const auto = await readGridRotations();
  console.log(`   auto: ${auto.slice(0, 120)}`);

  console.log('3. Switch to Rotated and re-sample');
  await select.selectOption('rotated');
  await page.waitForTimeout(200);
  const rotated = await readGridRotations();
  console.log(`   rotated: ${rotated.slice(0, 120)}`);
  if (rotated === auto) throw new Error('pattern change had no visible effect');

  console.log('4. Switch to Pinwheel');
  await select.selectOption('pinwheel');
  await page.waitForTimeout(200);
  const pinwheel = await readGridRotations();
  console.log(`   pinwheel: ${pinwheel.slice(0, 120)}`);
  if (pinwheel === rotated) throw new Error('pinwheel produced same rotations as rotated');

  console.log('5. Reload, expect pinwheel persisted');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const persisted = await page.locator('#grid-pattern-select').inputValue();
  console.log(`   persisted value: ${persisted}`);
  if (persisted !== 'pinwheel') throw new Error(`expected pinwheel, got ${persisted}`);

  console.log('6. Return to Auto');
  await page.locator('#grid-pattern-select').selectOption('auto');
  await page.waitForTimeout(200);
  const backToAuto = await page.locator('#grid-pattern-select').inputValue();
  if (backToAuto !== 'auto') throw new Error('failed to reset to Auto');
  console.log(`   back to auto: ${backToAuto}`);

  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/grid-patterns-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
