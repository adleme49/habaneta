import { createContext } from 'react';
import { IEditorState, IEditorDispatchers, initialStateEditor } from './editor.models';

const EditorContext = createContext<Partial<IEditorState & IEditorDispatchers>>(
  initialStateEditor
);

export default EditorContext;
