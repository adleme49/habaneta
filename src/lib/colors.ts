// Curated quick-pick palette for the tile editor.
//
// 36 colors in a 6×6 grid spanning the spectrum. Deliberately a
// broad set of hues rather than 105 shades of brown + blue-gray
// like the 2020 Antique Colonial catalog — users can always type a
// hex in the input or open the native color picker for anything
// else. These are just "one click away" shortcuts for common tile
// design choices.

export const colors: string[][] = [
  // neutrals
  ['#ffffff', '#e5e5e5', '#a1a1a1', '#525252', '#1f1f1f', '#000000'],
  // reds & pinks
  ['#fecaca', '#f87171', '#ef4444', '#b91c1c', '#7f1d1d', '#831843'],
  // oranges & yellows
  ['#fed7aa', '#fb923c', '#f97316', '#fbbf24', '#eab308', '#a16207'],
  // greens
  ['#bbf7d0', '#86efac', '#22c55e', '#16a34a', '#166534', '#064e3b'],
  // blues & teals
  ['#a5f3fc', '#22d3ee', '#3b82f6', '#1d4ed8', '#1e3a8a', '#0f766e'],
  // purples & browns
  ['#e9d5ff', '#a855f7', '#6b21a8', '#d6a373', '#92400e', '#451a03'],
];
