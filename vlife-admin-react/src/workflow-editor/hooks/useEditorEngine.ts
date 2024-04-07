import { useContext } from "react";
import { WorkflowEditorStoreContext } from "../contexts";
// dlc 封装成一个hooks，让代码更加清晰、可重用、可维护。
export function useEditorEngine() {
  //dlc 使用useContext来订阅WorkflowEditorStoreContext上下文的值
  return useContext(WorkflowEditorStoreContext)
}