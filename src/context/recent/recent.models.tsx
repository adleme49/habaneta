import { ITile, IFloor, IBorder } from '../interfaces';

export interface IRecentState {
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  recent: ITile[];
}
export interface IRecentDispatchers {
  selectFloor: (tile: string) => void;
  selectBorder: (tile: string) => void;
  deleteRecent: (tile: string) => void;
}
