import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto(`${process.env.WEB_URL || 'http://localhost:3000'}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('Open gallery modal');
  await page.getByRole('button', { name: 'Gallery' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/gallery-1.png', fullPage: false });

  console.log('Click next');
  await page.getByLabel('Next').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/gallery-2.png', fullPage: false });

  console.log('Click next again');
  await page.getByLabel('Next').click();
  await page.waitForTimeout(300);

  console.log('Click prev');
  await page.getByLabel('Previous').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/gallery-3.png', fullPage: false });

  console.log(`\nErrors: ${errors.length}`);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
} finally {
  await browser.close();
}
