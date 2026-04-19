// One-off UI audit: take the empty-state + a populated-state screenshot of the
// preview header so we can critique the current layout.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PE:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('CE:', m.text()); });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/ui-home-empty.png', fullPage: false });

// Populate: pick a tile → commit to recents
await page.getByText(/Contemporary/).first().click();
await page.waitForTimeout(400);
const firstTile = page.locator('#grid svg, .grid svg, [data-index] svg').first();
await firstTile.click().catch(() => {});
await page.waitForTimeout(300);
const commit = page.getByRole('button').filter({ hasText: /Save to recent|recent/i }).first();
if (await commit.count()) await commit.click();
await page.waitForTimeout(500);

// Pick a border too
await page.getByText(/Victorian/).first().click();
await page.waitForTimeout(400);
const borders = await page.locator('.svg-wrapper, [data-index] svg').all();
if (borders[1]) {
  await borders[1].click();
  await page.waitForTimeout(300);
  const c2 = page.getByRole('button').filter({ hasText: /Save to recent|recent/i }).first();
  if (await c2.count()) await c2.click();
}
await page.waitForTimeout(500);

await page.screenshot({ path: '/tmp/ui-home-populated.png', fullPage: false });

// Crop to just the header strip (approximate)
const header = page.locator('div').filter({ hasText: /PATTERN|GRID SIZE/ }).first();
await header.screenshot({ path: '/tmp/ui-header.png' }).catch(() => {});

await browser.close();
console.log('saved /tmp/ui-home-empty.png /tmp/ui-home-populated.png /tmp/ui-header.png');
