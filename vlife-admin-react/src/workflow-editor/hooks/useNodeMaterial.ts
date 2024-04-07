import { IWorkFlowNode } from "../interfaces";
import { useEditorEngine } from "./useEditorEngine";

export function useNodeMaterial(node?: IWorkFlowNode) {
  const store = useEditorEngine()

  return store?.materials.find(material => material.defaultConfig?.nodeType === node?.nodeType)
}