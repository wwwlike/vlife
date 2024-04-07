import { useCallback, useEffect, useState } from "react"
import { useEditorEngine } from "./useEditorEngine"

export function useSelectedId() {
  const [selectedId, setSelectedId] = useState<string>()
  const store = useEditorEngine()

  const handleSelectedChange = useCallback((selected: string | undefined) => {
    setSelectedId(selected)
  }, [])

  useEffect(() => {
    const unsub = store?.subscribeSelectedChange(handleSelectedChange)
    return unsub
  }, [handleSelectedChange, store])

  useEffect(() => {
    setSelectedId(store?.store.getState().selectedId)
  }, [store?.store])

  return selectedId
}