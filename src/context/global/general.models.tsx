import {
  ITileFamily,
  IBorderFamily,
  IColor,
  ITile,
  IBorder,
  IFloor,
  IFamily
} from '../interfaces';

export interface IGeneralState {
  loading: boolean;
  showModal: boolean;
  preview: boolean;
  error: null | any;
  tilesFamilys: ITileFamily[];
  borderFamilys: IBorderFamily[];
  colors: IColor[];
  showEnviromentModal: boolean;
  showSaveModal: boolean;
  recentsUsed: Array<ITile>;
  selectedTile?: ITile;
  latestBorder?: IBorder;
  latestFloor?: IFloor;
  selectedFamily?: IFamily;
}

export interface IGlobalDispatchers {
  setCurrentFamily: (current: ITileFamily | IBorderFamily) => void;
  setCurrentTile: (current: IFloor | IBorder) => void;
  addToRecent: (current: IFloor | IBorder) => void;
  deleteRecent: (index: number) => void;
  setShowSaveModal: () => void;
  setShowEnviromentModal: () => void;
  setCurrentTilefromRecent: (current: IFloor | IBorder) => void;
  setPreview: () => void;
}
