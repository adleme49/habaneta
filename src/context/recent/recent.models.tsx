import { ITile, IFloor, IBorder } from '../interfaces';
import { recent } from '../seed';

export interface IRecentState {
  count: number;
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedTileIndex?: number;
  selectedFloorIndex?: number;
  selectedBorderIndex?: number;
  recent: ITile[];
}
export interface IRecentDispatchers {
  selectLatest: (index: number) => void;
  addRecent: (tile: ITile) => void;
  deleteRecent: (index: number) => void;
  updateSelected: (tile: ITile) => void;
}

export const initialDispachersRecent: IRecentDispatchers = {
  selectLatest: (index: number) => {},
  addRecent: (tile: ITile) => {},
  deleteRecent: (index: number) => {},
  updateSelected: (tile: ITile) => {},
};

export const initialStateRecent: IRecentState = {
  recent,
  count: 0
};
