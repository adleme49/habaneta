import { IAction, ITile, IFloor, IBorder } from '../interfaces';

export const ADD_RECENT = '[Recent] ADD RECENT';
export const SELECT_LATEST = '[Recent] SELECT LATEST';
export const DELETE_RECENT = '[Recent] DELETE RECENT';

export class AddRecent implements IAction {
  readonly type = ADD_RECENT;
  constructor(public payload: ITile) {}
}
export class SelectLatest implements IAction {
  readonly type = SELECT_LATEST;
  constructor(public payload: number) {}
}
export class DeleteRecent implements IAction {
  readonly type = DELETE_RECENT;
  constructor(public payload: number) {}
}

export type RecentAction = AddRecent | SelectLatest | DeleteRecent;
