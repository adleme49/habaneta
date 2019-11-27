import { ITile, IFloor, IBorder } from '../interfaces';
import { recent } from '../seed';

export interface IRecentState {
  count: number;
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

export const initialStateRecent: IRecentState = {
  recent,
  count: 0
};
