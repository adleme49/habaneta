import { ITile, IFloor, IBorder } from '../interfaces';

export interface IRecentState {
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedFloorIndex?: number;
  selectedBorderIndex?: number;
  recent: ITile[];
}
export interface IRecentDispatchers {
  selectLatest: (index: number) => void;
  addRecent: (tile: ITile) => void;
  deleteRecent: (index: number) => void;
}
