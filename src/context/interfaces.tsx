export type Dict<T> = { [key: string]: T };

export interface ITileFamily extends IFamily {
  name: string;
  types: IFloor[];
}
export interface IBorderFamily extends IFamily {
  name: string;
  types: IBorder[];
}

export interface IFamily {
  type: 'Border' | 'Floor';
}

export interface ITile {
  name: string;
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
}
export interface IColor {
  name: string;
  code: string;
}
export interface IAction {
  type: string;
  payload?: any;
}
