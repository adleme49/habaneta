import { DomiColors, tilesFamilys, borderFamilys, recentsUsed } from './seed';

export interface IGeneralState {
  loading: boolean;
  showEnviromentModal: boolean;
  showSaveModal: boolean;
  error: null | any;
  tilesFamilys: ITileFamily[];
  borderFamilys: IBorderFamily[];
  colors: IColor[];
  selectedFamily: null | ITileFamily | IBorderFamily;
  selectedTile: null | IFloor | IBorder;
  latestFloor: null | IFloor;
  latestBorder: null | IBorder;
  recentsUsed: Array<IFloor | IBorder>;
  preview: boolean;
  selectedColor: string;
}

export interface ITileFamily extends Family {
  name: string;
  types: IFloor[];
}
export interface IBorderFamily extends Family {
  name: string;
  types: IBorder[];
}

export interface Family {
  type: string;
}

export interface ITile {
  imgUrl?: string;
  name: string;
  type?: 'Border' | 'Floor';
}
export interface IFloor extends ITile {
  rotation?: boolean;
}

export interface IBorder extends ITile {
  corner?: boolean;
}
export interface IColor {
  name: string;
  code: string;
}
export interface IAction {
  type: string;
  payload?: any;
}

export const initialDomivalues: IGeneralState = {
  loading: false,
  showEnviromentModal: false,
  showSaveModal: false,
  colors: DomiColors,
  tilesFamilys: tilesFamilys,
  borderFamilys: borderFamilys,
  selectedFamily: null,
  recentsUsed: recentsUsed,
  latestFloor: null,
  latestBorder: null,
  error: null,
  selectedTile: null,
  preview: false,
  selectedColor: 'grey'
};
