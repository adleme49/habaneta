// Curated quick-pick palette for the tile editor.
//
// 36 colors in a 4×9 grid drawn from the pigments traditionally
// used in encaustic cement tiles (Cuban, Catalan, Andalusian),
// Portuguese azulejo, and Mexican talavera. This is a heritage
// palette: muted earths, iron oxides, cobalt, manganese, and
// bone/ivory grounds — not the saturated web-UI defaults.
//
// Anything off this grid is reachable via the hex input or the
// native OS color picker, and users can persist their own custom
// colors in a separate row (see `user-colors.ts`).
//
// Row structure:
//   Row 1 — Grounds & neutrals (linen, bone, clay, charcoal)
//   Row 2 — Iron reds & earth (peach → oxblood)
//   Row 3 — Ochres, saffron, mustard, tobacco
//   Row 4 — Greens, teals, cobalt, manganese

export const colors: string[][] = [
  // Row 1 — Grounds & neutrals. These are the tile "backgrounds":
  // delft white, Andalusian bone, limestone, warm slate, through
  // to charcoal and black. White and ivory kept side by side because
  // the difference matters in tile work.
  [
    '#ffffff', // pure white
    '#f3ebd8', // delft / ivory
    '#e6dcc4', // bone
    '#d1c9b0', // limestone
    '#a59d8a', // stone grey
    '#6b6960', // warm slate
    '#3a3a35', // charcoal
    '#1c1c1c', // near-black
    '#000000', // black
  ],
  // Row 2 — Iron-oxide reds from palest blush through classic
  // terracotta to oxblood. These are the dominant "figure" colors
  // in Cuban and Catalan tiles.
  [
    '#f4c6b2', // peach blush
    '#e9a98d', // muted peach
    '#d4805e', // clay
    '#c65a3a', // talavera terracotta
    '#b63d2b', // iron red
    '#a04427', // mission rust
    '#7b2f21', // burnt sienna
    '#5a1e16', // oxblood
    '#3c1612', // deep burgundy
  ],
  // Row 3 — Yellow earths: ochre, saffron, mustard, tobacco.
  // Historically from ground earth pigments; the palette reads
  // as sun-faded when placed next to Row 1 grounds.
  [
    '#fbecba', // butter
    '#f3d98a', // sand
    '#e5a83c', // saffron
    '#d4a94a', // ochre
    '#b38b2f', // mustard
    '#8f6b28', // antique gold
    '#5e481f', // tobacco
    '#c9945c', // clay yellow
    '#e4c17e', // faded butter (Havana)
  ],
  // Row 4 — Jewel tones: art-deco mints, Mediterranean teals,
  // Portuguese cobalt, and manganese-purple which gives
  // azulejo tiles their characteristic violet-black shadows.
  [
    '#b8e3d1', // art-deco mint
    '#7fb8a9', // seafoam
    '#5a9b9e', // faded teal (Havana)
    '#3e6b48', // forest green
    '#2b5f3e', // bottle green
    '#3d7bc8', // mid cobalt
    '#1e3a8a', // deep cobalt
    '#5d4066', // manganese purple
    '#a197b3', // lavender-gray
  ],
];
