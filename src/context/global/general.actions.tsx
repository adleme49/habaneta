import { IAction, IFloor, IBorder, IFamily } from '../interfaces';

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

export const SHOW_GALLERY_MODAL = '[GLOBAL] SHOW_GALLERY_MODAL';
export const CLOSE_MODALS = '[GLOBAL] CLOSE MODALS';
export const SET_SVG_HEIGHT = '[GLOBAL] SET SVG HEIGHT';
export const SET_SVG_WIDTH = '[GLOBAL] SET SVG WIDTH';
export const SAVE_GRID_IMG = '[GLOBAL] SAVE_GRID_IMG';
export const TOGGLE_OVERLAY = '[GLOBAL] TOGGLE_OVERLAY';

export class ToggleOverlay implements IAction {
  readonly type = TOGGLE_OVERLAY;
}
export class SetSVGWidth implements IAction {
  readonly type = SET_SVG_WIDTH;
  constructor(public payload: number) {}
}
export class SetSVGHeight implements IAction {
  readonly type = SET_SVG_HEIGHT;
  constructor(public payload: number) {}
}

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
export class SetShowGalleryModal implements IAction {
  readonly type = SHOW_GALLERY_MODAL;
}
export class CloseModals implements IAction {
  readonly type = CLOSE_MODALS;
}
export class SaveGridImg implements IAction {
  readonly type = SAVE_GRID_IMG;
  constructor(public payload: string) {}
}

export type GlobalAction =
  | ToggleOverlay
  | SetSVGHeight
  | SetSVGWidth
  | CloseModals
  | SetCurrentFamily
  | SetCurrentTile
  | SetLatest
  | SetCurrentTilefromRecent
  | AddtoRecent
  | DeleteRecent
  | EnableRecent
  | DisableRecent
  | SetShowEnviromentModal
  | SetShowGalleryModal
  | SaveGridImg
  | SetShowSaveModal;
