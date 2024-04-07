import { Action, ActionType, SetChangeFlagAction } from "../actions"

export function changeFlagReducer(state: boolean, action: Action): boolean {
  switch (action.type) {
    case ActionType.SET_CHANGE_FLAG: {
      return (action as SetChangeFlagAction).payload?.changeFlag
    }
    case ActionType.SET_START_NODE: {
      return false
    }
    case ActionType.SET_REDOLIST:
    case ActionType.SET_UNOLIST:
      return true
  }
  return state
}