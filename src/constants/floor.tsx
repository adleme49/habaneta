// A floor grid pattern describes how the 4 sub-cells of a 2×2 "macro
// cell" are individually rotated. Values are rotation angles in degrees
// for [topLeft, topRight, bottomLeft, bottomRight] (mod 360 — extra
// full turns are harmless).
//
// Each Body row renders one macro cell; the floor is a vertical stack
// of macro cells, so the same 4 angles repeat on every row.

const SIMPLE = [0, 0, 0, 0];
const ROTATED = [90, 90, 90, 90];
/** Historical "default": pinwheel — each sub-cell rotated 90° relative
 *  to the next. Values are multiples of 90° with extra full turns. */
const PINWHEEL = [450, 180, 720, 990];
/** Top row vs bottom row mirrored (flipped vertically). */
const MIRROR_X = [0, 0, 180, 180];
/** Left column vs right column mirrored (flipped horizontally). */
const MIRROR_Y = [0, 180, 0, 180];
/** Diagonal twins: (TL, BR) share one orientation, (TR, BL) the other. */
const CHECKERBOARD = [0, 180, 180, 0];

export interface GridPattern {
  id: string;
  /** Key under `preview.gridPatterns.<key>` in i18n. */
  i18nKey: string;
  /** 4 rotation angles [TL, TR, BL, BR]. */
  angles: readonly number[];
}

export const GRID_PATTERNS: readonly GridPattern[] = [
  { id: 'simple', i18nKey: 'simple', angles: SIMPLE },
  { id: 'rotated', i18nKey: 'rotated', angles: ROTATED },
  { id: 'pinwheel', i18nKey: 'pinwheel', angles: PINWHEEL },
  { id: 'mirrorX', i18nKey: 'mirrorX', angles: MIRROR_X },
  { id: 'mirrorY', i18nKey: 'mirrorY', angles: MIRROR_Y },
  { id: 'checkerboard', i18nKey: 'checkerboard', angles: CHECKERBOARD },
];

export const DEFAULT_GRID_PATTERN_ID = 'pinwheel';

export const findGridPattern = (id: string): GridPattern | undefined =>
  GRID_PATTERNS.find((p) => p.id === id);

/** Kept for backward compatibility with `context/seed.tsx` and any
 *  TileSource whose `grids` list refers to these arrays directly. */
export const floorGrid = {
  DEFAULT: PINWHEEL,
  SIMPLE,
  ROTATED,
};

const getAngle = (pos: number, def = PINWHEEL) => (grid: number[] | undefined) =>
  grid ? grid[pos] : def[pos];

export const getTopLeftAngle = getAngle(0);
export const getTopRightAngle = getAngle(1);
export const getBottomLeftAngle = getAngle(2);
export const getBottomRightAngle = getAngle(3);

export const getNextGrid = (grids: Array<number[]>, current: number) =>
  grids[current + 1] ? [grids[current + 1], current + 1] : [grids[0], 0];
