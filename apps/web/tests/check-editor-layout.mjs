// Verify the rehauled editor column:
//  - Stacking order: presets strip → tile + actions → palette.
//  - "+ New preset" opens a modal with a name input.
//  - Saving a preset renders a chip with palette dots.
//  - Rename modal works.
//  - Column fits in viewport without scrolling on a 1080p-ish screen.

import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('1. Load a tile into the editor');
  await page.getByText(/Contemporary/).first().click();
  await page.waitForTimeout(400);
  await page.locator('#grid svg, .grid svg, [data-index] svg').first().click().catch(() => {});
  await page.waitForTimeout(400);

  console.log('2. Verify stacking order (presets/tile/palette y-coords)');
  const geom = await page.evaluate(() => {
    // Presets chip-bar container: find the "New preset" button's parent row.
    const newBtn = Array.from(document.querySelectorAll('button'))
      .find((b) => /New preset/.test(b.textContent || ''));
    const presetsRow = newBtn?.parentElement;
    // Tile SVG container: the big injected SVG in the column.
    const tileDiv = document.querySelector('.aspect-square.w-full');
    // Palette: the hex input's parent cluster.
    const hex = document.querySelector('input[placeholder="#rrggbb"]');
    const palette = hex?.parentElement;
    return {
      presetsTop: presetsRow?.getBoundingClientRect().top ?? null,
      tileTop: tileDiv?.getBoundingClientRect().top ?? null,
      paletteTop: palette?.getBoundingClientRect().top ?? null,
    };
  });
  console.log(`   presets: ${geom.presetsTop}  tile: ${geom.tileTop}  palette: ${geom.paletteTop}`);
  if (!(geom.presetsTop < geom.tileTop && geom.tileTop < geom.paletteTop)) {
    throw new Error('stacking order is wrong — expected presets < tile < palette');
  }

  console.log('3. Click + New preset → modal opens');
  await page.getByRole('button', { name: /New preset/ }).click();
  await page.waitForTimeout(300);
  const input = page.locator('#preset-name-input');
  await input.waitFor({ timeout: 3000 });
  console.log('   modal visible: true');

  console.log('4. Type a name and Save');
  await input.fill('Heritage terra');
  await page.getByRole('button', { name: /^Save$/ }).click();
  await page.waitForTimeout(400);
  const chipExists = await page.getByText('Heritage terra').isVisible();
  console.log(`   chip rendered: ${chipExists}`);
  if (!chipExists) throw new Error('preset chip not visible after save');

  console.log('5. Hover the chip → rename + delete affordances');
  const chip = page.locator('div').filter({ hasText: /^Heritage terra$/ }).first();
  await chip.hover();
  await page.waitForTimeout(200);
  const renameBtn = page.getByRole('button', { name: /Rename Heritage terra/ });
  const renameVisible = await renameBtn.isVisible();
  console.log(`   rename affordance: ${renameVisible}`);

  console.log('6. Rename via modal');
  await renameBtn.click();
  await page.waitForTimeout(300);
  await input.fill('Havana rust');
  await page.getByRole('button', { name: /^Save$/ }).click();
  await page.waitForTimeout(400);
  const renamed = await page.getByText('Havana rust').isVisible();
  console.log(`   renamed chip visible: ${renamed}`);

  console.log('7. No vertical scroll at 1000px viewport');
  const scroll = await page.evaluate(() => {
    // The editor column is the middle <main> child of the 3-col layout.
    // Find a container that has overflow-y-auto and check its scrollHeight.
    const columns = document.querySelectorAll('.overflow-y-auto');
    const editor = Array.from(columns).find((el) => el.querySelector('input[placeholder="#rrggbb"]'));
    if (!editor) return null;
    return {
      scrollH: editor.scrollHeight,
      clientH: editor.clientHeight,
      overflows: editor.scrollHeight > editor.clientHeight + 2,
    };
  });
  console.log(`   editor column overflow: ${JSON.stringify(scroll)}`);

  // Cleanup: delete the test preset.
  await page.locator('div').filter({ hasText: /^Havana rust$/ }).first().hover();
  await page.waitForTimeout(200);
  const delBtn = page.getByRole('button', { name: /Delete Havana rust/ });
  if (await delBtn.count()) await delBtn.click();
  await page.waitForTimeout(300);

  await page.screenshot({ path: '/tmp/editor-layout.png', clip: { x: 230, y: 0, width: 540, height: 980 } });
  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/editor-layout-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
