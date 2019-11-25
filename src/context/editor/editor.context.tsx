import { createContext } from 'react';
import { IEditorState, IEditorDispatchers } from './editor.models';

const EditorContext = createContext<Partial<IEditorState & IEditorDispatchers>>(
  {}
);

export default EditorContext;
