import { ConditionGroup, Conditions } from '@src/dsl/base'
import { IApproverSettings } from '../classes/vlife'

export enum NodeType {
  //开始节点
  start = "start",
  //审批人
  approver = "approver",
  //抄送人？
  notifier = "notifier",
  //处理人？
  audit = "audit",
  //路由(条件节点)，下面包含分支节点
  route = "route",
  //分支节点
  condition = "condition",
}

//审批流节点
export interface IWorkFlowNode<abc = unknown>{
  id: string
  //名称
  name?: string
  //string可以用于自定义节点，暂时用不上
  nodeType: NodeType | string 
  //描述
  desc?: string
  //子节点
  childNode?: IWorkFlowNode
  //当前审核节点的配置
  approverSettings?:IApproverSettings ;
  //条件
  conditions?:ConditionGroup[];
  //配置
  config?: abc
}

//条件根节点，下面包含各分支节点
export interface IRouteNode extends IWorkFlowNode {
  //分支节点
  conditionNodeList: IBranchNode[]
}

//条件分支的子节点，分支节点
export interface IBranchNode extends IWorkFlowNode {
  //条件表达式，后端就是这样的名字，保留了
  //后面考虑通过泛型放入config，视条件复杂度决定
  //flowNodeConditionVOList?: IExpression[]
}

//审批流，代表一张审批流图
export interface IWorkflow {
  //审批流Id
  flowId: string;
  //审批流名称
  name?:string;
  //开始节点
  startNode: IWorkFlowNode;
}