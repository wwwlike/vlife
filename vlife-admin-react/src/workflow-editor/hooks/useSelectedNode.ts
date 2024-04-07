import { useEditorEngine } from "./useEditorEngine";
import { useSelectedId } from "./useSelectedId";

export function useSelectedNode() {
  const selectedId = useSelectedId();
  const store = useEditorEngine();

  return selectedId ? store?.getNode(selectedId) : undefined
}