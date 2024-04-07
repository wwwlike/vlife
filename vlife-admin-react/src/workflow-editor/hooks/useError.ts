import { useCallback, useEffect, useState } from "react"
import { IErrors } from "../interfaces/state"
import { useEditorEngine } from "./useEditorEngine"

export function useError(nodeId: string) {
  const [errors, setErrors] = useState<IErrors>()

  const store = useEditorEngine()

  const handleErrorsChange = useCallback((errs: IErrors) => {
    setErrors(errs)
  }, [])

  useEffect(() => {
    const unsub = store?.subscribeErrorsChange(handleErrorsChange)
    return unsub
  }, [handleErrorsChange, store])

  useEffect(() => {
    setErrors(store?.store.getState().errors)
  }, [store?.store])

  return errors?.[nodeId]
}