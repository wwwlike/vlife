
import {IModel,PageVo,DbEntity,Result, PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 流程部署
export interface FlowDeployment extends DbEntity{
  json: string;
}

//流程字段配置信息
export interface FlowField extends IModel{
  fieldName:string; //字段标识
  title:string;//字段名
  type:string;//字段类型
  access:string;//访问性(显隐读写)
}


// 审批节点信息
export interface AuditInfo extends IModel{
  auditList: NodeUserInfo[];  // 常规审批对象
  emptyPass: string;  // 审批人为空时策略
  handleType: string;  // 办理人员类型
  auditLevel: AuditLevel;  // 逐级审批对象
  transfer:boolean;// 转办
  emptyUserId:string;// 空办理人
  addSign:boolean;// 加签
  recall:boolean;//撤回
  rollback:boolean;//回退
  rejected:boolean;//拒绝
  fields:FlowField[];//流程字段配置
}

// 审核节点配置
export interface IApproverSettings extends AuditInfo{
  joinType:string; //会签类型
}
// 逐层审批配置
export interface AuditLevel extends IModel{
}

// 节点参与对象信息
export interface NodeUserInfo extends IModel{
  userType: string;  // 参办对象类型
  label:string;
  objectId: string;  //  办理对象id (选择部分节点时 是表达式)
  el: string;  // 参与人或组的表达式
}
/** 分页查询*/
export const page=(req:PageQuery): Promise<Result<PageVo<FlowDeployment>>>=>{
  return apiClient.post(`/flowDeployment/page`,req);
};
/** 列表查询*/
export const list=(req:PageQuery): Promise<Result<FlowDeployment[]>>=>{
  return apiClient.post(`/flowDeployment/list`,req);
};
/** 保存*/
export const save=(flowDeployment:FlowDeployment): Promise<Result<FlowDeployment>>=>{
  return apiClient.post(`/flowDeployment/save`,flowDeployment);
};
/** 启动流程*/
export const start=(req:{processDefinitionKey:string,instanceName:string}): Promise<Result<boolean>>=>{
return apiClient.get(`/flowDeployment/start`,{params:req});
};
/** xml*/
export const xml=(): Promise<Result<string>>=>{
  return apiClient.get(`/flowDeployment/xml`);
};
/** 是包含候选任务的*/
export const myTasks=(): Promise<Result<number>>=>{
  return apiClient.get(`/flowDeployment/myTasks`);
};
/** 完成待办任务*/
export const completeTask=(): Promise<Result<boolean>>=>{
  return apiClient.get(`/flowDeployment"/completeTask"`);
};
/** 明细查询*/
export const detail=(req:{id:string}): Promise<Result<FlowDeployment>>=>{
  return apiClient.get(`/flowDeployment/detail/${req.id}`);
};
/** 逻辑删除*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/flowDeployment/remove`,{data:ids});
};