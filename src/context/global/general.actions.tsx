import {
  IAction,
  IFloor,
  IBorder,
  IFamily
} from '../interfaces';

export const SET_CURRENT_FAMILY = '[GLOBAL] SET_CURRENT_FAMILY';
export const SET_CURRENT_TILE = '[GLOBAL] SET_CURRENT_TILE';
export const SET_LATEST = '[GLOBAL] SET_LATEST';
export const SET_CURRENT_TILE_FROM_RECENT =
  '[GLOBAL] SET_CURRENT_TILE_FROM_RECENT';
export const ADD_TO_RECENT = '[GLOBAL] ADD_TO_RECENT';
export const DELETE_RECENT = '[GLOBAL] DELETE_RECENT';
export const SHOW_ENVIROMENT_MODAL = '[GLOBAL] SHOW_ENVIROMENT_MODAL';
export const SHOW_SAVE_MODAL = '[GLOBAL] SHOW_SAVE_MODAL';
export const ENABLE_RECENT = '[GLOBAL] ENABLE RECENT';
export const DISABLE_RECENT = '[GLOBAL] DISABLE RECENT';

export class SetCurrentFamily implements IAction {
  readonly type = SET_CURRENT_FAMILY;
  constructor(public payload: IFamily) {}
}

export class SetCurrentTile implements IAction {
  readonly type = SET_CURRENT_TILE;
  constructor(public payload: IFloor | IBorder) {}
}

export class SetCurrentTilefromRecent implements IAction {
  readonly type = SET_CURRENT_TILE_FROM_RECENT;
  constructor(public payload: IFloor | IBorder) {}
}

export class SetLatest implements IAction {
  readonly type = SET_LATEST;
}

export class AddtoRecent implements IAction {
  readonly type = ADD_TO_RECENT;
  constructor(public payload: IFloor | IBorder) {}
}

export class DeleteRecent implements IAction {
  readonly type = DELETE_RECENT;
  constructor(public payload: number) {}
}

export class SetShowEnviromentModal implements IAction {
  readonly type = SHOW_ENVIROMENT_MODAL;
}

export class SetShowSaveModal implements IAction {
  readonly type = SHOW_SAVE_MODAL;
}
export class EnableRecent implements IAction {
  readonly type = ENABLE_RECENT;
}
export class DisableRecent implements IAction {
  readonly type = DISABLE_RECENT;
}

export type GlobalAction =
  | SetCurrentFamily
  | SetCurrentTile
  | SetLatest
  | SetCurrentTilefromRecent
  | AddtoRecent
  | DeleteRecent
  | EnableRecent
  | DisableRecent
  | SetShowEnviromentModal
  | SetShowSaveModal;
