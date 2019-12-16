import { IFloor } from '../context/interfaces';

const DEFAULT = [450, 180, 720, 990];
const SIMPLE = [0, 0, 0, 0];
const ROTATED = [90, 90, 90, 90];

export const floorGrid = {
  DEFAULT,
  SIMPLE,
  ROTATED
};

const getAngle = (pos: number, def = DEFAULT) => (grid: number[] | undefined) =>
  grid ? grid[pos] : def[pos];

export const getTopLeftAngle = getAngle(0);
export const getTopRightAngle = getAngle(1);
export const getBottomLeftAngle = getAngle(2);
export const getBottomRightAngle = getAngle(3);

export const getNextGrid = (grids: Array<number[]>, current: number) =>
  grids[current + 1] ? [grids[current + 1], current + 1] : [grids[0], 0];
