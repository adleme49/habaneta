// Photo-style adjustments for an extracted palette.
//
// Sliders are zero-centered: 0 means "no change". Each call rebuilds a
// hex from the source hex + the three slider values, deterministically.
//
// Why these three: for tile photos the failure modes are predictable —
// dim shots from a phone in a dark room (low exposure), harsh outdoor
// shots in noon sun (saturation cooked, blues blown to white), and warm
// indoor lighting under tungsten/incandescent (orange cast). These three
// sliders address that family of issues without pulling in a Lab/LCh
// implementation.

export interface PaletteAdjustments {
  /** -1..+1; lifts/cuts L (HSL). */
  exposure: number;
  /** -1..+1; positive = warmer (R↑ B↓), negative = cooler (R↓ B↑). */
  warmth: number;
  /** -1..+1; scales S (HSL). +1 doubles, -1 desaturates fully. */
  saturation: number;
}

export const NO_ADJUSTMENTS: PaletteAdjustments = {
  exposure: 0,
  warmth: 0,
  saturation: 0,
};

export function isNeutral(a: PaletteAdjustments): boolean {
  return a.exposure === 0 && a.warmth === 0 && a.saturation === 0;
}

/**
 * Apply the three adjustments to a hex color and return a new hex.
 * Order: warmth (RGB R/B shift) → saturation (HSL S scale) → exposure
 * (HSL L shift). Order matters: applying warmth in HSL would also drag
 * saturation since hue rotation isn't perceptually clean.
 */
export function adjustHex(hex: string, a: PaletteAdjustments): string {
  if (isNeutral(a)) return hex;
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Warmth: ±~30/255 push on the R/B channels (≈12% of dynamic range).
  // Picked empirically — strong enough to correct typical incandescent
  // casts without pegging to white at extreme settings.
  const w = a.warmth * 30;
  let { r, g, b } = rgb;
  r = clamp255(r + w);
  b = clamp255(b - w);

  const hsl = rgbToHsl(r, g, b);
  // Saturation: scale toward 0 (s * 0) on -1, toward 2× on +1.
  // Capped at [0, 1] in HSL space.
  hsl.s = clamp01(hsl.s * (1 + a.saturation));
  // Exposure: shift L by up to ±0.4 — full ±1 doesn't fully blow to
  // white/black, leaving room for adjustment without losing colors.
  hsl.l = clamp01(hsl.l + a.exposure * 0.4);

  const out = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(out.r, out.g, out.b);
}

// ---- Conversions ----

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const pad = (n: number) => clamp255(n).toString(16).padStart(2, '0');
  return `#${pad(r)}${pad(g)}${pad(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case rN:
      h = (gN - bN) / d + (gN < bN ? 6 : 0);
      break;
    case gN:
      h = (bN - rN) / d + 2;
      break;
    case bN:
      h = (rN - gN) / d + 4;
      break;
  }
  return { h: h * 60, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hue = ((h % 360) + 360) % 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hue < 60) [r1, g1, b1] = [c, x, 0];
  else if (hue < 120) [r1, g1, b1] = [x, c, 0];
  else if (hue < 180) [r1, g1, b1] = [0, c, x];
  else if (hue < 240) [r1, g1, b1] = [0, x, c];
  else if (hue < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}
