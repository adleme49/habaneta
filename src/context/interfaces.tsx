import { DomiColors, tilesFamilys, borderFamilys, recentsUsed } from './seed';

export interface IGeneralState {
  loading: boolean;
  showModal: boolean;
  error: null | any;
  tilesFamilys: ITileFamily[];
  borderFamilys: IBorderFamily[];
  colors: IColor[];
  selectedFamily: null | ITileFamily | IBorderFamily;
  selectedTile: null | IFloor | IBorder;
  recentsUsed: Array<IFloor | IBorder>;
  preview: boolean;
  selectedColor: string;
}

export interface ITileFamily {
  name: string;
  types: IFloor[];
}
export interface IBorderFamily {
  name: string;
  types: IBorder[];
}

export interface ITile {
  imgUrl?: string;
  name: string;
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
  showModal: false,
  colors: DomiColors,
  tilesFamilys: tilesFamilys,
  borderFamilys: borderFamilys,
  selectedFamily: null,
  recentsUsed: recentsUsed,
  error: null,
  selectedTile: null,
  preview: false,
  selectedColor: 'grey'
};
