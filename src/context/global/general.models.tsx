import {
  ITileFamily,
  IBorderFamily,
  IColor,
  ITile,
  IBorder,
  IFloor,
  IFamily
} from '../interfaces';
import { DomiColors, tilesFam, borderFam } from '../seed';

export interface IGeneralState {
  loading: boolean;
  showModal: boolean;
  error: null | any;
  tilesFamilys: ITileFamily[];
  borderFamilys: IBorderFamily[];
  colors: IColor[];
  showEnviromentModal: boolean;
  showSaveModal: boolean;
  selectedTile?: ITile;
  selectedFamily?: IFamily;
}

export interface IGlobalDispatchers {
  setCurrentFamily: (current: IFamily) => void;
  setCurrentTile: (current: IFloor | IBorder) => void;
  addToRecent: (current: IFloor | IBorder) => void;
  deleteRecent: (index: number) => void;
  setShowSaveModal: () => void;
  setShowEnviromentModal: () => void;
  setCurrentTilefromRecent: (current: IFloor | IBorder) => void;
}

export const initialDomivalues: IGeneralState = {
  loading: false,
  showModal: false,
  colors: DomiColors,
  tilesFamilys: tilesFam,
  borderFamilys: borderFam,
  showSaveModal: false,
  showEnviromentModal: false,
  error: null
};
