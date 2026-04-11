// Curated quick-pick palette for the tile editor.
//
// 36 colors laid out as 4 rows × 9 columns spanning the spectrum.
// Compact footprint in the editor (less vertical than a 6×6 grid)
// while still giving one-click access to a broad hue range.
// Anything off this grid is reachable via the hex input or the
// native OS color picker.

export const colors: string[][] = [
  // neutrals + first reds
  ['#ffffff', '#e5e5e5', '#a1a1a1', '#525252', '#1f1f1f', '#000000', '#fecaca', '#ef4444', '#7f1d1d'],
  // warm row: pinks, oranges, yellows
  ['#f87171', '#fb923c', '#f97316', '#fbbf24', '#eab308', '#a16207', '#fed7aa', '#831843', '#b91c1c'],
  // greens + teals
  ['#bbf7d0', '#86efac', '#22c55e', '#16a34a', '#166534', '#064e3b', '#0f766e', '#22d3ee', '#a5f3fc'],
  // blues, purples, browns
  ['#3b82f6', '#1d4ed8', '#1e3a8a', '#e9d5ff', '#a855f7', '#6b21a8', '#d6a373', '#92400e', '#451a03'],
];
