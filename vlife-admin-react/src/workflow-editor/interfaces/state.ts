import { IWorkFlowNode, NodeType } from "./workflow";

//操作快照，用于撤销、重做
export interface ISnapshot {
  //开始节点
  startNode: IWorkFlowNode,
  //是否校验过
  validated?: boolean,
}

//错误消息
export interface IErrors {
  [nodeId: string]: string | undefined
}

//状态
export interface IState {
  //是否被修改，该标识用于提示是否需要保存
  changeFlag: boolean,
  //撤销快照列表
  undoList: ISnapshot[],
  //重做快照列表
  redoList: ISnapshot[],
  //zoom: number,
  startNode: IWorkFlowNode,
  //被选中的节点，用于弹出属性面板
  selectedId?: string,
  //是否校验过，如果校验过，后面加入的节点会自动校验
  validated?: boolean,
  //校验错误
  errors: IErrors,
}

export const initialState: IState = {
  changeFlag: false,
  undoList: [],
  redoList: [],
  startNode: {
    id: "start",
    nodeType: NodeType.start,
  },
  errors: {}
}
