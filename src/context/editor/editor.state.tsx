import React, { useReducer } from "react";
import EditorReducer from "./editor.reducer";
import EditorContext from "./editor.context";
import { IEditorState } from "./editor.models";
import { ITile } from "../interfaces";
import { SetTile, SetColor } from "./editor.actions";

export const initialStateEditor: IEditorState = {
  selectedColor: "white"
};

const EditorState = (props: any): JSX.Element => {
  const initialState: IEditorState = initialStateEditor;
  const [{selectedColor, tile}, dispatch] = useReducer(EditorReducer, initialState);

  const setTile = (tile: ITile) => {
    dispatch(new SetTile(tile));
  };
  const setColor = (color: string) => {
    dispatch(new SetColor(color));
  };

  return (
    <EditorContext.Provider
      value={{
          selectedColor,
          tile,
          setTile,
          setColor
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export default EditorState;
