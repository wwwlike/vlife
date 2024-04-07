import { Action } from "../actions";
import { IState, initialState } from "../interfaces/state";
import { changeFlagReducer } from "./changeFlagReducer";
import { errorsReducer } from "./errorsReducer";
import { redoListReducer } from "./redoListReducer";
import { selectedIdReducer } from "./selectedIdReducer";
import { startNodeReducer } from "./startNodeReducer";
import { undoListReducer } from "./undoListReducer";
import { validatedReducer } from "./validatedReducer";

export const mainReducer = (
  { changeFlag, redoList, undoList, startNode, selectedId, validated, errors }: IState = initialState,
  action: Action
): IState => ({
  changeFlag: changeFlagReducer(changeFlag, action),
  redoList: redoListReducer(redoList, action),
  undoList: undoListReducer(undoList, action),
  startNode: startNodeReducer(startNode, action),
  selectedId: selectedIdReducer(selectedId, action),
  validated: validatedReducer(validated, action),
  errors: errorsReducer(errors, action),
});
