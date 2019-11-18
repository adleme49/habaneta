import { IAction, ITile } from "../interfaces";

export const SET_COLOR = "[Editor] SET COLOR";
export const SET_TILE = "[Editor] SET TILE";

export class SetColor implements IAction {
  readonly type = SET_COLOR;
  constructor(public payload: string) {}
}
export class SetTile implements IAction {
  readonly type = SET_TILE;
  constructor(public payload: ITile) {}
}

export type EditorAction = SetColor | SetTile;
