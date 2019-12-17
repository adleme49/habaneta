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
  selectedTile?: ITile;
  selectedFamily?: IFamily;
}

export interface IGlobalDispatchers {
  setCurrentFamily: (current: IFamily) => void;
  setCurrentTile: (current: IFloor | IBorder) => void;
  setShowSaveModal: () => void;
  setShowGalleryModal: () => void;
  setShowEnviromentModal: () => void;
  closeModals: () => void;
  setSVGHeight: (height: number) => void;
  enableRecent: () => void;
  disableRecent: () => void;
  setCurrentTilefromRecent: (current: IFloor | IBorder) => void;
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
  setCurrentTilefromRecent: (current: IFloor | IBorder) => {},
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
