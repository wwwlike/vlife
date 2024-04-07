//表达式操作符
export enum OperatorType {
  //等于
  Eq = "eq",
  //不等于
  Ne = "ne",
  //大于
  Gt = "gt",
  //小于,
  Lt = "lt",
  //小于等于
  Le = "le",
  //大于等于
  Ge = "ge",
  //包含
  Like = "like",
  //开头包含
  LikeStart = "like_start",
  //结尾包含
  LikeEnd = "like_end",
  //不为空
  NotEmpty = "not_empty",
  //为空
  Empty = "empty"
}

//这个命名需要优化
// export interface IExpression {
//   fieldEnName?: string,
//   fieldName?: string,
//   fieldValue?: unknown,
//   operatorType?: OperatorType,
// }

export enum ExpressionNodeType {
  Expression = "expression",
  Group = "group"
}

export interface IExpressionNode {
  id: string
  nodeType: ExpressionNodeType
}

export interface IExpression extends IExpressionNode {
  name?: string,
  value?: unknown,
  operator?: OperatorType,
}

export enum ExpressionGroupType {
  And = "and",
  Or = "or"
}

export interface IExpressionGroup extends IExpressionNode {
  groupType: ExpressionGroupType,
  children: IExpression[] | IExpressionGroup[]
}

export interface IExtCondition extends IExpression {
  flowId?: string
  flowNodeId?: string
  sort?: number
  groupIndex?: number
}

export enum AuthType {
  read = "read",
  edit = "edit",
  hide = "hide",
}

export interface IAuthItem {
  fieldEnName: string,
  type: AuthType,
}