export type Dict<T> = { [key: string]: T };

export interface IFamily {
  type: 'Border' | 'Floor';
  name: string;
  types: ITile[];
}

export interface ITileFamily extends IFamily {
  types: IFloor[];
}
export interface IBorderFamily extends IFamily {
  types: IBorder[];
}

export interface ITile {
  name: string;
  id?: string;
  layers?: Dict<string>;
  imgUrl?: string;
  svgUrl?: string;
  type?: 'Border' | 'Floor';
}
export interface IFloor extends ITile {
  rotation?: boolean;
}

export interface IBorder extends ITile {
  corner?: boolean;
  cornerUrl?: string;
}
export interface IColor {
  name: string;
  code: string;
}
export interface IAction {
  type: string;
  payload?: any;
}
