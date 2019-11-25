import { IAction, ITile, IFloor, IBorder } from "../interfaces";

export const SELECT_FLOOR = "[Recent] SELECT FLOOR";
export const SELECT_BORDER = "[Recent] SELECT BORDER";
export const DELETE_RECENT = "[Recent] DELETE RECENT";

export class SelectFloor implements IAction {
  readonly type = SELECT_FLOOR;
  constructor(public payload: IFloor) {}
}
export class SelectBorder implements IAction {
  readonly type = SELECT_BORDER;
  constructor(public payload: IBorder) {}
}
export class DeleteRecent implements IAction {
  readonly type = DELETE_RECENT;
  constructor(public payload: number) {}
}

export type RecentAction = SelectFloor | SelectBorder | DeleteRecent;
