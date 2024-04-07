import { IErrors, ISnapshot } from "./state"
import { IWorkFlowNode } from "./workflow"

export type ZoomChangeListener = (zoom: number) => void
export type StartNodeListener = (rootNode: IWorkFlowNode) => void
export type UndoListChangeListener = (undos: ISnapshot[]) => void
export type RedoListChangeListener = (redos: ISnapshot[]) => void
export type ChangeFlagChangeListener = (changeFlag: number) => void
export type SelectedListener = (id: string | undefined) => void
export type ErrorsListener = (errors: IErrors) => void