import React, { useReducer } from "react";
import EditorReducer from "./editor.reducer";
import EditorContext from "./editor.context";
import { IEditorState } from "./editor.models";
import { ITile } from "../interfaces";
import { SetTile, SetColor, PaintLayer } from "./editor.actions";

export const initialStateEditor: IEditorState = {
  selectedColor: "white",
  tile: {
    name: "Test",
    svgUrl: "../assets/Tile/Contemporary/tile.svg",
    layers: {
      "l1": "white",
      "l2": "white",
      "l3": "white",
      "l4": "white",
      "l5": "white",
      "l6": "white",
    }
  }
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
  const paintLayer = (layerId: string) => {
    dispatch(new PaintLayer(layerId));
  };
  return (
    <EditorContext.Provider
      value={{
          selectedColor,
          tile,
          setTile,
          setColor,
          paintLayer
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export default EditorState;
