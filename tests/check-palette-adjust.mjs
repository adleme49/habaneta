// Pure-function unit smoke for src/lib/palette-adjust.ts.
//
// Runs in a Playwright page so we can dynamic-import the .ts module
// straight from the dev server (Vite transpiles on the fly). Avoids
// adding a tsx-runner script just for this single test.
//
// Skips when the dev server is unreachable.

import { chromium } from 'playwright';

const FRONTEND_URL = 'http://localhost:3000';

async function devReachable() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(FRONTEND_URL, { signal: ctrl.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

if (!(await devReachable())) {
  console.log(`[skip] dev server not reachable at ${FRONTEND_URL}`);
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage();
let exitCode = 0;
try {
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });

  const result = await page.evaluate(async () => {
    const m = await import('/src/lib/palette-adjust.ts');
    const failures = [];
    const eq = (got, want, msg) => {
      if (got !== want) failures.push(`${msg}: got ${got}, want ${want}`);
    };
    const near = (got, want, tol, msg) => {
      const d = Math.abs(parseInt(got.slice(1, 3), 16) - parseInt(want.slice(1, 3), 16))
              + Math.abs(parseInt(got.slice(3, 5), 16) - parseInt(want.slice(3, 5), 16))
              + Math.abs(parseInt(got.slice(5, 7), 16) - parseInt(want.slice(5, 7), 16));
      if (d > tol) failures.push(`${msg}: got ${got} too far from ${want} (Δrgb=${d}, tol=${tol})`);
    };

    // identity
    eq(m.adjustHex('#ff00ff', m.NO_ADJUSTMENTS), '#ff00ff', 'no-op leaves color');
    eq(m.isNeutral(m.NO_ADJUSTMENTS), true, 'NO_ADJUSTMENTS is neutral');
    eq(m.isNeutral({ exposure: 0.1, warmth: 0, saturation: 0 }), false, 'non-zero is not neutral');

    // exposure brightens
    {
      const dim = '#404040';
      const lit = m.adjustHex(dim, { exposure: 0.5, warmth: 0, saturation: 0 });
      const r0 = parseInt(dim.slice(1,3), 16);
      const r1 = parseInt(lit.slice(1,3), 16);
      if (!(r1 > r0)) failures.push(`exposure +0.5 should brighten R: ${dim} -> ${lit}`);
    }
    // negative exposure darkens
    {
      const lit = '#c0c0c0';
      const dim = m.adjustHex(lit, { exposure: -0.5, warmth: 0, saturation: 0 });
      const r0 = parseInt(lit.slice(1,3), 16);
      const r1 = parseInt(dim.slice(1,3), 16);
      if (!(r1 < r0)) failures.push(`exposure -0.5 should darken: ${lit} -> ${dim}`);
    }

    // warmth +1 shifts toward orange (R up, B down)
    {
      const gray = '#808080';
      const warm = m.adjustHex(gray, { exposure: 0, warmth: 1, saturation: 0 });
      const r = parseInt(warm.slice(1, 3), 16);
      const b = parseInt(warm.slice(5, 7), 16);
      if (!(r > 128 && b < 128)) {
        failures.push(`warmth +1 should push R↑ B↓: ${gray} -> ${warm}`);
      }
    }
    // warmth -1 shifts toward blue (R down, B up)
    {
      const gray = '#808080';
      const cool = m.adjustHex(gray, { exposure: 0, warmth: -1, saturation: 0 });
      const r = parseInt(cool.slice(1, 3), 16);
      const b = parseInt(cool.slice(5, 7), 16);
      if (!(r < 128 && b > 128)) {
        failures.push(`warmth -1 should push R↓ B↑: ${gray} -> ${cool}`);
      }
    }

    // saturation -1 desaturates fully (R≈G≈B)
    {
      const vivid = '#cc4422';
      const flat = m.adjustHex(vivid, { exposure: 0, warmth: 0, saturation: -1 });
      const r = parseInt(flat.slice(1, 3), 16);
      const g = parseInt(flat.slice(3, 5), 16);
      const b = parseInt(flat.slice(5, 7), 16);
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (spread > 4) {
        failures.push(`saturation -1 should produce gray: ${vivid} -> ${flat} (spread=${spread})`);
      }
    }

    // bad input falls through unchanged
    eq(m.adjustHex('not-a-color', { exposure: 0.5, warmth: 0, saturation: 0 }), 'not-a-color',
       'unparseable input returns as-is');

    // 3-digit hex parses
    near(m.adjustHex('#fff', m.NO_ADJUSTMENTS), '#fff', 999, 'short hex round-trip');

    return { failures };
  });

  if (result.failures.length) {
    for (const f of result.failures) console.error('FAIL:', f);
    exitCode = 1;
  } else {
    console.log('palette-adjust smoke: ok');
  }
} catch (err) {
  console.error('palette-adjust smoke failed:', err.message ?? err);
  exitCode = 1;
} finally {
  await browser.close();
  process.exit(exitCode);
}
