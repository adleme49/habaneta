import { ITile } from "../interfaces";

export interface IEditorState {
  selectedColor: string;
  tile?: ITile;
}
export interface IEditorDispatchers {
  setColor: (color: string) => void;
  setTile: (tile: ITile) => void;
}

