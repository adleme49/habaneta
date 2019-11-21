import {
  ITileFamily,
  IBorderFamily,
  IColor,
  ITile,
  IBorder,
  IFloor,
  IFamily
} from "../interfaces";

export interface IGeneralState {
  loading: boolean;
  showModal: boolean;
  preview: boolean;
  error: null | any;
  tilesFamilys: ITileFamily[];
  borderFamilys: IBorderFamily[];
  colors: IColor[];
  recentsUsed: Array<ITile>;
  selectedTile?: ITile;
  latestBorder?: IBorder;
  latestFloor?: IFloor;
  selectedFamily?: IFamily;
}
