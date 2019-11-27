import { ITile } from '../interfaces';

export interface IEditorState {
  selectedColor: string;
  tile?: ITile;
}
export interface IEditorDispatchers {
  setColor: (color: string) => void;
  setTile: (tile: ITile) => void;
  paintLayer: (layerId: string) => void;
}

export const initialDispachers: IEditorDispatchers = {
  setColor: (color: string) => {},
  setTile: (tile: ITile) => {},
  paintLayer: (layerId: string) => {}
};
export const initialStateEditor: IEditorState = {
  selectedColor: 'white'
};
