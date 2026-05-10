// Exercises the grid size stepper and the multi-ambient picker.

import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // --- Grid size stepper ---
  console.log('1. Default grid body rows = 3');
  const defaultRows = await page.locator('[aria-live="polite"]').textContent();
  console.log(`   counter: "${defaultRows}"`);

  console.log('2. Click "+" twice → 5');
  await page.getByLabel('More rows').click();
  await page.waitForTimeout(150);
  await page.getByLabel('More rows').click();
  await page.waitForTimeout(150);
  const after = await page.locator('[aria-live="polite"]').textContent();
  console.log(`   counter: "${after}"`);

  console.log('3. "-" button should step back');
  await page.getByLabel('Fewer rows').click();
  await page.waitForTimeout(150);
  const afterMinus = await page.locator('[aria-live="polite"]').textContent();
  console.log(`   counter: "${afterMinus}"`);

  console.log('4. "+" past the old 6 cap still works (new cap is 20)');
  await page.getByLabel('More rows').click();
  await page.getByLabel('More rows').click();
  await page.getByLabel('More rows').click();
  await page.waitForTimeout(200);
  const past6 = await page.locator('[aria-live="polite"]').textContent();
  console.log(`   counter: "${past6}"`);
  if (past6 !== '7') {
    throw new Error(`expected 7 after bumping past old max, got ${past6}`);
  }
  // Step back down so the later ambient capture works with a
  // reasonable grid size.
  for (let i = 0; i < 4; i++) {
    await page.getByLabel('Fewer rows').click();
  }
  await page.waitForTimeout(150);

  // --- Ambient picker ---
  console.log('5. Pick a floor + border so Enviroment capture works');
  await page.getByText(/^Contemporary/).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);
  await page.getByText('Save to recents').click();
  await page.waitForTimeout(300);

  console.log('6. Open Environment modal');
  await page.getByRole('button', { name: 'Environment' }).click();
  // Wait for the dom-to-image capture to complete and modal to open
  await page.waitForTimeout(1200);

  console.log('7. Default ambient = Bathroom');
  const bathroomBtn = page.getByRole('button', { name: 'Bathroom' });
  const bathroomClasses = (await bathroomBtn.getAttribute('class')) ?? '';
  console.log(`   Bathroom active: ${bathroomClasses.includes('bg-primary')}`);

  console.log('8. Switch to Kitchen');
  await page.getByRole('button', { name: 'Kitchen' }).click();
  await page.waitForTimeout(200);
  const kitchenClasses =
    (await page.getByRole('button', { name: 'Kitchen' }).getAttribute('class')) ?? '';
  console.log(`   Kitchen active: ${kitchenClasses.includes('bg-primary')}`);

  // Verify the background image src actually switched
  const ambientSrc = await page
    .locator('img[alt="Kitchen"]')
    .getAttribute('src');
  console.log(`   Kitchen img src: ${ambientSrc}`);

  await page.screenshot({ path: '/tmp/visualization.png', fullPage: false });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/visualization-error.png', fullPage: true });
} finally {
  await browser.close();
}
