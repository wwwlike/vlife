import { Action, ActionType, SetStartNodeAction } from "../actions";
import { IWorkFlowNode } from "../interfaces";
import { nodeReducer } from "./nodeReducer";

export function startNodeReducer(state: IWorkFlowNode, action: Action): IWorkFlowNode {
  switch (action.type) {
    case ActionType.SET_START_NODE: {
      return (action as SetStartNodeAction).payload.node
    }
    case ActionType.DELETE_NODE:
    case ActionType.ADD_NODE:
    case ActionType.CHANGE_NODE: {
      return nodeReducer(state, action)
    }
  }
  return state
}