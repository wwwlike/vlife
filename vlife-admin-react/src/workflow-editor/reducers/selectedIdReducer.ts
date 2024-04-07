import { Action, ActionType, SelectNodeAction } from "../actions"

export function selectedIdReducer(state: string | undefined, action: Action): string | undefined {
  switch (action.type) {
    case ActionType.SELECT_NODE: {
      return (action as SelectNodeAction).payload?.id
    }
  }
  return state
}