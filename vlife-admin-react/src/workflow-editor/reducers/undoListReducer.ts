import { Action, ActionType, UnRedoListAction } from "../actions";
import { ISnapshot } from "../interfaces/state";

export function undoListReducer(state: ISnapshot[], action: Action): ISnapshot[] {
  switch (action.type) {
    case ActionType.SET_UNOLIST: {
      return (action as UnRedoListAction).payload.list
    }
  }
  return state
}