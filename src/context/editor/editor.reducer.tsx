import { IEditorState } from "./editor.models";
import {
  SET_TILE,
  SET_COLOR,
  PAINT_LAYER,
  EditorAction
} from "./editor.actions";

const reducer = (state: IEditorState, action: EditorAction): IEditorState => {
  switch (action.type) {
    case SET_TILE:
      const selectedTile = action.payload;
      return { ...state, tile: selectedTile };
    case SET_COLOR:
      const selectedColor = action.payload;
      return { ...state, selectedColor };
    case PAINT_LAYER:
      const layer = action.payload;
      const layers = state.tile
        ? { ...state.tile.layers, [layer]: state.selectedColor }
        : {};
      const tile: any = state.tile ? { ...state.tile, layers } : {};
      return tile ? { ...state, tile } : state;
    default:
      return state;
  }
};

export default reducer;
