import { chromium } from 'playwright';

const browser = await chromium.launch();
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(800);
  // Simulate the full flow at this viewport
  await page.getByText('Traditional', { exact: true }).click();
  await page.waitForTimeout(300);
  await page.locator('.svg-wrapper').first().click();
  await page.waitForTimeout(300);
  // Check if save button is visible
  const saveButton = page.getByText(/Salvar a recientes|Already in recents/);
  const visible = await saveButton.isVisible().catch(() => false);
  const box = visible ? await saveButton.boundingBox() : null;
  await page.screenshot({ path: `/tmp/vp-${vp.name}.png`, fullPage: true });
  console.log(`${vp.name.padEnd(8)} ${vp.width}x${vp.height}  save button visible: ${visible}  ${box ? `at y=${Math.round(box.y)}` : ''}`);
  await ctx.close();
}

await browser.close();
