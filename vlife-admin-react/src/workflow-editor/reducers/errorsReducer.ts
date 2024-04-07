import { Action, ActionType, SetErrorsAction } from "../actions";
import { IErrors } from "../interfaces/state";

export function errorsReducer(state: IErrors, action: Action): IErrors {
  switch (action.type) {
    case ActionType.SET_ERRORS: {
      return (action as SetErrorsAction).payload?.errors
    }
  }
  return state
}