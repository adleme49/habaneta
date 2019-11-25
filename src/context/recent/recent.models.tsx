import { ITile, IFloor, IBorder } from '../interfaces';

export interface IRecentState {
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  recent: ITile[];
}
export interface IRecentDispatchers {
  selectFloor: (tile: IFloor) => void;
  selectBorder: (tile: IBorder) => void;
  deleteRecent: (index: number) => void;
}
