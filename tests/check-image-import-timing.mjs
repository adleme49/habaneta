// Measure how long the full import pipeline takes at current
// TILE_PX/GRID. Runs in the browser context so Vite transforms the TS.

import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

try {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const result = await page.evaluate(async () => {
    // Build an 800×800 checkerboard to mimic the user's azulejo.
    const N = 800, CELLS = 4;
    const cv = document.createElement('canvas');
    cv.width = N; cv.height = N;
    const ctx = cv.getContext('2d');
    const C = N / CELLS;
    for (let r = 0; r < CELLS; r++) {
      for (let c = 0; c < CELLS; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#e8b330' : '#f0ead8';
        ctx.fillRect(c * C, r * C, C, C);
      }
    }
    const blob = await new Promise((res) => cv.toBlob(res, 'image/png'));
    const file = new File([blob], 't.png', { type: 'image/png' });
    // Dynamic import so Vite compiles the TS.
    const mod = await import('/src/lib/image-import.ts');
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const t0 = performance.now();
      const r = await mod.importImageAsTile(file, { layerCount: 2 });
      const t1 = performance.now();
      runs.push({
        ms: Math.round(t1 - t0),
        layers: Object.keys(r.layers).length,
        paths: (r.svgText.match(/<path/g) || []).length,
        bytes: r.svgText.length,
      });
    }
    return runs;
  });

  console.log('Timing runs:');
  for (const r of result) console.log(`  ${r.ms}ms  layers=${r.layers} paths=${r.paths} svg=${r.bytes}B`);
  console.log('\nErrors:', errors.length);
  errors.forEach((e) => console.log('  ERROR:', e.slice(0, 200)));
} catch (e) {
  console.log('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
