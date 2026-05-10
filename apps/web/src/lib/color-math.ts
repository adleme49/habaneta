// Tiny color helpers for deriving shades/tints of a base color.
//
// No external deps — we just need RGB mix (lerp toward black/white).
// Good enough for a visual "ramp" row in the editor: users click a
// base color from the preset grid, then click any darker/lighter
// variant to get a consistent family across layers.

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex(r: number, g: number, b: number): string {
  const pad = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${pad(r)}${pad(g)}${pad(b)}`;
}

function mix(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
): { r: number; g: number; b: number } {
  return {
    r: a.r * (1 - t) + b.r * t,
    g: a.g * (1 - t) + b.g * t,
    b: a.b * (1 - t) + b.b * t,
  };
}

const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };

/**
 * Generate a symmetric ramp of N shades centered on `base`.
 *
 *   [darkest, ..., base, ..., lightest]
 *
 * Default N=9 → 4 darker + base + 4 lighter.
 *
 * Returns a list of hex strings. If `base` doesn't parse, returns
 * an empty array so callers can just hide the row.
 */
export function generateShades(base: string, count = 9): string[] {
  const rgb = parseHex(base);
  if (!rgb) return [];
  const half = Math.floor(count / 2);
  const darker: string[] = [];
  for (let i = half; i > 0; i--) {
    const mixed = mix(rgb, BLACK, i / (half + 1));
    darker.push(toHex(mixed.r, mixed.g, mixed.b));
  }
  const lighter: string[] = [];
  for (let i = 1; i <= half; i++) {
    const mixed = mix(rgb, WHITE, i / (half + 1));
    lighter.push(toHex(mixed.r, mixed.g, mixed.b));
  }
  return [...darker, base, ...lighter];
}
