import { createContext } from "react";
import { IEditorState, IEditorDispatchers } from "./editor.models";

const EditorContext = createContext<(IEditorState & IEditorDispatchers) | any>(
  {}
);

export default EditorContext;
