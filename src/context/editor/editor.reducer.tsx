import { IEditorState } from "./editor.models";
import { SET_TILE, EditorAction, SET_COLOR } from "./editor.actions";

const reducer = (state: IEditorState, action: EditorAction) => {
  switch (action.type) {
    case SET_TILE:
      const selectedTile = action.payload;
      return { ...state, selectedTile };
    case SET_COLOR:
      const selectedColor = action.payload;
      return { ...state, selectedColor };
    default:
      return state;
  }
};

export default reducer;
