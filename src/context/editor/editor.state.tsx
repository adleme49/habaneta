import React, { useReducer, useContext } from 'react';
import EditorReducer from './editor.reducer';
import EditorContext from './editor.context';
import { IEditorState, initialStateEditor } from './editor.models';
import { ITile } from '../interfaces';
import { SetTile, SetColor, PaintLayer } from './editor.actions';
import RecentContext from '../recent/recent.context';

const EditorState = (props: any): JSX.Element => {
  const initialState: IEditorState = initialStateEditor;
  const [{ selectedColor, tile }, dispatch] = useReducer(
    EditorReducer,
    initialState
  );
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
