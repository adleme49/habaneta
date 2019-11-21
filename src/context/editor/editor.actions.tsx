import { IAction, ITile } from "../interfaces";

export const SET_COLOR = "[Editor] SET COLOR";
export const SET_TILE = "[Editor] SET TILE";
export const PAINT_LAYER = "[Editor] PAINT LAYER";

export class SetColor implements IAction {
  readonly type = SET_COLOR;
  constructor(public payload: string) {}
}
export class SetTile implements IAction {
  readonly type = SET_TILE;
  constructor(public payload: ITile) {}
}
export class PaintLayer implements IAction {
  readonly type = PAINT_LAYER;
  constructor(public payload: string) {}
}

export type EditorAction = SetColor | SetTile | PaintLayer;
