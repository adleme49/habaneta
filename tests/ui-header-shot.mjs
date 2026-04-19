// Focused crop of the preview header strip (recents + pattern + grid size)
// so we can scrutinize it at a larger scale.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Populate 2 floors + 1 border
async function pickAndCommit(family) {
  await page.getByText(new RegExp(family)).first().click();
  await page.waitForTimeout(400);
  const t = page.locator('#grid svg, .grid svg, [data-index] svg').first();
  await t.click().catch(() => {});
  await page.waitForTimeout(300);
  const c = page.getByRole('button').filter({ hasText: /Save to recent|recent/i }).first();
  if (await c.count()) await c.click();
  await page.waitForTimeout(400);
}

await pickAndCommit('Contemporary');
// Pick a second Contemporary tile and commit
await page.getByText(/Contemporary/).first().click();
await page.waitForTimeout(300);
const tiles2 = await page.locator('.svg-wrapper, [data-index] svg').all();
if (tiles2[3]) {
  await tiles2[3].click();
  await page.waitForTimeout(300);
  const c = page.getByRole('button').filter({ hasText: /Save to recent|recent/i }).first();
  if (await c.count()) await c.click();
  await page.waitForTimeout(400);
}
await pickAndCommit('Victorian');

// Full shot for reference
await page.screenshot({ path: '/tmp/ui-full.png', fullPage: false });

// Crop the preview header strip: roughly right 60% × top 140px
const clip = { x: 800, y: 0, width: 800, height: 160 };
await page.screenshot({ path: '/tmp/ui-header-crop.png', clip });
console.log('saved');
await browser.close();
