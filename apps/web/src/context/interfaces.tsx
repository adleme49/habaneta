import type { PipelineOutput } from '../lib/habanetaBackend';

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
  /**
   * Backend pipeline output for tiles produced by the image-import
   * service. When present, the SVG renderer should bypass the legacy
   * `paintLayer`/`<ReactSVG>` injection path and render via
   * `<CompositionCanvas>` so classed paths recolor through CSS vars.
   */
  pipeline?: PipelineOutput;
}
export interface IFloor extends ITile {
  rotation?: boolean;
  grids?: Array<number[]>;
}

export interface IBorder extends ITile {
  corner?: boolean;
  cornerUrl?: string;
  cornerInteriorUrl?: string;
}
