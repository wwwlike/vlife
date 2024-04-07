import { Action, ActionType, SetValidatedAction } from "../actions"

export function validatedReducer(state: boolean | undefined, action: Action): boolean | undefined {
  switch (action.type) {
    case ActionType.SET_VALIDATED: {
      return (action as SetValidatedAction).payload?.validated
    }
  }
  return state
}