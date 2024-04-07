import { createContext } from "react";
import { EditorEngine } from "./classes";
//dlc  创建一个 EditorEngine上下文
export const WorkflowEditorStoreContext = createContext<EditorEngine | undefined>(undefined)