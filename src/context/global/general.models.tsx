import {
  ITileFamily,
  IBorderFamily,
  ITile,
  IBorder,
  IFloor,
  IFamily
} from '../interfaces';
import { tilesFam, borderFam, colors } from '../seed';

export interface IGeneralState {
  loading: boolean;
  showModal: boolean;
  error: null | any;
  tilesFamilys: ITileFamily[];
  borderFamilys: IBorderFamily[];
  colors: Array<string[]>;
  showEnviromentModal: boolean;
  showGalleryModal: boolean;
  showSaveModal: boolean;
  isRecent: boolean;
  svgHeight?: number;
  svgWidth?: number;
  selectedTile?: ITile;
  selectedFamily?: IFamily;
  gridImg?: string;
}

export interface IGlobalDispatchers {
  setCurrentFamily: (current: IFamily) => void;
  setCurrentTile: (current: IFloor | IBorder) => void;
  setShowSaveModal: () => void;
  setShowGalleryModal: () => void;
  setShowEnviromentModal: () => void;
  closeModals: () => void;
  setSVGHeight: (height: number) => void;
  setSVGWidth: (width: number) => void;
  enableRecent: () => void;
  disableRecent: () => void;
  setCurrentTilefromRecent: (current: IFloor | IBorder) => void;
  saveGridImg: (img: string) => void;
}

export const initialGlobalDispatchers: IGlobalDispatchers = {
  setCurrentFamily: (current: IFamily) => {},
  setCurrentTile: (current: IFloor | IBorder) => {},
  setShowSaveModal: () => {},
  setShowEnviromentModal: () => {},
  setShowGalleryModal: () => {},
  closeModals: () => {},
  enableRecent: () => {},
  disableRecent: () => {},
  setSVGHeight: (height: number) => {},
  setSVGWidth: (width: number) => {},
  setCurrentTilefromRecent: (current: IFloor | IBorder) => {},
  saveGridImg: (img: string) => {}
};
export const initialDomivalues: IGeneralState = {
  loading: false,
  showModal: false,
  colors: colors,
  tilesFamilys: tilesFam,
  borderFamilys: borderFam,
  showSaveModal: false,
  showGalleryModal: false,
  showEnviromentModal: false,
  isRecent: false,
  error: null
};
