import { useCallback, useEffect, useState } from "react"
import { useEditorEngine } from "./useEditorEngine"
import { ISnapshot } from "../interfaces/state"

export function useRedoList() {
  const [redoList, setRedoList] = useState<ISnapshot[]>([])
  const store = useEditorEngine()

  const handleRedoListChange = useCallback((list: ISnapshot[]) => {
    setRedoList(list)
  }, [])

  useEffect(() => {
    const unsub = store?.subscribeRedoListChange(handleRedoListChange)
    return unsub
  }, [handleRedoListChange, store])

  useEffect(() => {
    setRedoList(store?.store.getState().redoList || [])
  }, [store?.store])

  return redoList
}