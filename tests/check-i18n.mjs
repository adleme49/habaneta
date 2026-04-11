// Smoke test for the i18n setup: load the app, verify English copy
// is present, click the ES pill, verify Spanish copy appears,
// verify the language persists after a reload.

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
  await page.waitForTimeout(500);
  // Start clean
  await page.evaluate(() => localStorage.removeItem('habaneta:lang'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  console.log('1. English (default) visible');
  const enBrowser = await page.getByText('Tile Browser', { exact: true }).isVisible();
  const enEditor = await page.getByText('Editor', { exact: true }).isVisible();
  const enPreview = await page.getByText('Preview', { exact: true }).isVisible();
  console.log(`   browser "Tile Browser": ${enBrowser}`);
  console.log(`   editor "Editor": ${enEditor}`);
  console.log(`   preview "Preview": ${enPreview}`);

  console.log('2. Click ES in the language switcher');
  await page.getByRole('button', { name: 'ES', exact: true }).click();
  await page.waitForTimeout(300);

  const esBrowser = await page.getByText('Buscador de Lozas').isVisible();
  const esPreview = await page.getByText('Vista previa').isVisible();
  console.log(`   browser "Buscador de Lozas": ${esBrowser}`);
  console.log(`   preview "Vista previa": ${esPreview}`);

  console.log('3. Reload → Spanish persists');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const persisted = await page.getByText('Buscador de Lozas').isVisible();
  console.log(`   persisted after reload: ${persisted}`);

  console.log('4. Switch back to EN');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.waitForTimeout(200);
  const backToEn = await page.getByText('Tile Browser').isVisible();
  console.log(`   back to EN: ${backToEn}`);

  // Clean up
  await page.evaluate(() => localStorage.removeItem('habaneta:lang'));

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  await page.screenshot({ path: '/tmp/i18n-error.png', fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
