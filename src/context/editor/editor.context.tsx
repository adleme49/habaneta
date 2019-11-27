import { createContext } from 'react';
import {
  IEditorState,
  IEditorDispatchers,
  initialStateEditor,
  initialDispachers
} from './editor.models';

const EditorContext = createContext<IEditorState & IEditorDispatchers>(
  { ...initialStateEditor, ...initialDispachers }
);

export default EditorContext;
