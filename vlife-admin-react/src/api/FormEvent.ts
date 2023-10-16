import {
  DbEntity,
  PageQuery,
  PageVo,
  Result,
  SaveBean,
  VoBean,
} from "@src/api/base";
import apiClient from "@src/api/base/apiClient";
import { FormReaction, FormReactionVo } from "@src/api/FormReaction";
// 触发事件
export interface FormEvent extends DbEntity {
  formId: string;
  attr: string;
  formFieldId: string; // 触发的字段下面这个字段要转到多对多的表，做成多个字段值域变化影响相关字段的响应还需要做成，根据系统变量，或者其他表的字段的变量.如用户查询权限，操作权限
  val: string; // 字段值
  eventType: string; // 触发的事件类型
  title: string; // 事件名称
  sys:boolean;// 前台自动选择新增隐藏，修改只读时自动产生的数据
}

export interface FormEventPageReq extends PageQuery {
  formId: string; // 表单模型id
}

// 字段事件响应表单
export interface FormEventDto extends SaveBean {
  name: string; // 事件完整描述
  formId: string; //表
  formFieldId: string; // 事件字段
  attr: string; //属性
  eventType: string; // 触发的事件类型
  val: string; // 匹配的值
  reactions: Partial<FormReaction>[]; //响应内容
}

// 字段事件响应表单
export interface FormEventVo extends VoBean {
  name: string; // 事件完整描述
  formId: string; //表
  formFieldId: string; // 事件字段
  fieldName:string;//字段名
  attr: string; //属性
  eventType: string; // 触发的事件类型
  val: string; // 匹配的值
  reactions: Partial< FormReactionVo>[]; //响应内容
  sys:boolean;// 系统产生的封装； 前台自动选择新增隐藏，修改只读时自动产生的数据
}

/**
 * 分页列表
 */
export const page = (
  req: FormEventPageReq
): Promise<Result<PageVo<FormEvent>>> => {
  return apiClient.get(`/formEvent/page`, { params: req });
};

/**
 * 分页列表
 */
export const listFormEventVo = (
  formId: string
): Promise<Result<FormEventVo[]>> => {
  return apiClient.get(`/formEvent/list/formEventVo/${formId}`);
};

/**
 * 表单保存
 */
export const saveFormEventDto = (
  dto: Partial<FormEventDto>
): Promise<Result<FormEventDto>> => {
  return apiClient.post(`/formEvent/save/formEventDto`, dto);
};
