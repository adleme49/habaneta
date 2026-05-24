import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

const errors = [];
const warnings = [];

page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
  if (msg.type() === 'warning') warnings.push(msg.text());
});

page.on('pageerror', err => errors.push(err.message));

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  const title = await page.title();
  const bodyText = await page.locator('body').innerText();
  const visibleText = bodyText.slice(0, 500);

  console.log('=== PAGE TITLE ===');
  console.log(title);
  console.log('\n=== VISIBLE TEXT (first 500 chars) ===');
  console.log(visibleText);
  console.log('\n=== CONSOLE ERRORS ===');
  errors.forEach(e => console.log('  ERROR:', e));
  console.log('\n=== CONSOLE WARNINGS ===');
  warnings.forEach(w => console.log('  WARN:', w.slice(0, 200)));

  await page.screenshot({ path: '/tmp/app-screenshot.png', fullPage: true });
  console.log('\n=== SCREENSHOT saved to /tmp/app-screenshot.png ===');

  if (errors.length === 0) {
    console.log('\n✓ No console errors detected');
  } else {
    console.log(`\n✗ ${errors.length} console error(s) detected`);
  }
} catch (e) {
  console.log('PAGE LOAD FAILED:', e.message);
} finally {
  await browser.close();
}
