import { IWorkFlowNode } from "../interfaces";
import { useEditorEngine } from "./useEditorEngine";

export function useMaterialUI(node?: IWorkFlowNode) {
  const store = useEditorEngine()

  return store?.materialUis?.[node?.nodeType || ""]
}