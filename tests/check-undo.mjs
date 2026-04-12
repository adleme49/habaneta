// End-to-end: undo/redo for color painting in the editor.
// Verifies button state, keyboard shortcuts, and that reset
// and undo interact correctly.

import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://localhost:3000/home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  console.log('1. Select a tile to edit');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);

  // Undo/redo buttons should be disabled (no history yet).
  const undoBtn = page.getByLabel('Undo');
  const redoBtn = page.getByLabel('Redo');
  const undoDisabled1 = await undoBtn.isDisabled();
  const redoDisabled1 = await redoBtn.isDisabled();
  console.log(`   undo disabled: ${undoDisabled1}, redo disabled: ${redoDisabled1}`);
  if (!undoDisabled1) throw new Error('undo should be disabled before any paint');
  if (!redoDisabled1) throw new Error('redo should be disabled before any paint');

  console.log('2. Paint two layers');
  // The SVG is injected async by ReactSVG. Wait for shapes to appear
  // inside the editor column. Shapes have class="colora stN".
  await page.waitForSelector('[class^="colora "]', { timeout: 5000 });
  await page.waitForTimeout(300);

  // Pick a distinctive color first via the hex input.
  const hexInput = page.locator('input[aria-label="Hex color value"]');
  if (await hexInput.count()) {
    await hexInput.fill('#ff0000');
    await hexInput.press('Enter');
    await page.waitForTimeout(100);
  }

  // Find the paintable shapes. They're inside the large editor SVG
  // (the one in the max-w-[480px] container), not the tiny browser
  // thumbnails. Target the first [class^="colora "] shapes inside
  // the aspect-square editor wrapper.
  const paintableShapes = page.locator('.aspect-square [class^="colora "]');
  const shapeCount = await paintableShapes.count();
  console.log(`   paintable shapes: ${shapeCount}`);

  if (shapeCount < 2) {
    throw new Error(`need at least 2 paintable shapes, got ${shapeCount}`);
  }

  // Use force:true — background shapes may be covered by others but
  // the SVG onClick handler reads event.target's class regardless.
  await paintableShapes.nth(0).click({ force: true });
  await page.waitForTimeout(200);
  await paintableShapes.nth(1).click({ force: true });
  await page.waitForTimeout(200);

  const undoDisabled2 = await undoBtn.isDisabled();
  console.log(`   undo disabled after 2 paints: ${undoDisabled2}`);
  if (undoDisabled2) throw new Error('undo should be enabled after painting');

  console.log('3. Undo via keyboard (Ctrl+Z)');
  await page.keyboard.press('Control+z');
  await page.waitForTimeout(200);

  // After one undo, redo should be enabled and undo still enabled
  // (we painted twice, undid once → 1 entry behind cursor).
  const canRedo3 = !(await redoBtn.isDisabled());
  const canUndo3 = !(await undoBtn.isDisabled());
  console.log(`   canUndo: ${canUndo3}, canRedo: ${canRedo3}`);
  if (!canRedo3) throw new Error('redo should be enabled after one undo');
  if (!canUndo3) throw new Error('undo should still be enabled (one more paint to undo)');

  console.log('4. Redo via keyboard (Ctrl+Y)');
  await page.keyboard.press('Control+y');
  await page.waitForTimeout(200);

  const canRedo4 = !(await redoBtn.isDisabled());
  console.log(`   canRedo after redo: ${canRedo4}`);
  if (canRedo4) throw new Error('redo should be disabled after redoing the last action');

  console.log('5. Undo via button click');
  await undoBtn.click();
  await page.waitForTimeout(200);
  const canRedo5 = !(await redoBtn.isDisabled());
  console.log(`   canRedo after button undo: ${canRedo5}`);
  if (!canRedo5) throw new Error('redo should be enabled after button undo');

  console.log('6. Reset colors is undoable');
  // Redo back to the latest state, then reset, then undo the reset.
  await redoBtn.click();
  await page.waitForTimeout(100);
  await page.getByText('Reset colors').click();
  await page.waitForTimeout(200);

  const canUndoReset = !(await undoBtn.isDisabled());
  console.log(`   canUndo after reset: ${canUndoReset}`);
  if (!canUndoReset) throw new Error('undo should be enabled after reset (reset is undoable)');

  // Undo the reset → redo should now be enabled.
  await undoBtn.click();
  await page.waitForTimeout(200);
  const canRedoAfterUndoReset = !(await redoBtn.isDisabled());
  console.log(`   canRedo after undoing reset: ${canRedoAfterUndoReset}`);
  if (!canRedoAfterUndoReset) throw new Error('redo should be enabled after undoing the reset');

  console.log('7. Selecting a different tile resets history');
  const wrappers = await page.locator('.svg-wrapper').all();
  if (wrappers.length > 1) {
    await wrappers[1].click();
    await page.waitForTimeout(300);
  }
  const undoDisabledNewTile = await undoBtn.isDisabled();
  const redoDisabledNewTile = await redoBtn.isDisabled();
  console.log(`   undo disabled: ${undoDisabledNewTile}, redo disabled: ${redoDisabledNewTile}`);
  if (!undoDisabledNewTile || !redoDisabledNewTile) {
    throw new Error('history should reset when selecting a different tile');
  }

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/undo-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
