import apiClient from "@src/api/base/apiClient";
import { BatchModifyDto, DbEntity, ItemType,  Result, SaveBean, VoBean } from "@src/api/base";

import {  FormFieldDto, FormFieldVo } from "@src/api/FormField";
import { FormTabDto } from '@src/api/FormTab';
import { SysResources } from './SysResources';
// import { FormRuleDto } from './FormRule';

/**
 * DB的模型信息
 */
export interface Form extends DbEntity {
  title: string; //模型名称
  type: string; //标识
  itemType: ItemType// 类型
  entityType: string;
  name: string; //前端命名的名称
  sort:number; //排序号
  icon:string;//图标
  modelSize:number;//模块大小 12网格里的占比大小
  pageSize:number;//分页大小
  version:number;  //模型版本
  listApiPath:string; //列表请求ts方法地址
  saveApiPath:string; //数据保存ts方法地址
  prefixNo:string;//编号前缀
  sysMenuId:string;//所属应用
  formDesc:string;//描述
  itemName:string;//主字段表达式
  helpDoc:string;//开发帮助文档
  typeParentsStr:string;//模型类接口
  flowJson:string;//已发布流程脚本
  unpublishJson:string;//未发布的流程脚本
  // flowDefineKey:string;//流程定义key
}

/**
 * 保存的模型结构
 */
export interface FormDto extends SaveBean,Form{
  fields: FormFieldDto[]; //字段信息
  formTabDtos?:FormTabDto[];//页签信息
  resources?:SysResources[];//关联接口
}

/**
 * 视图展示层的VO模型，包涵
 * 1. java模型 modelInfo
 * 2. 关联表数据 FormDto
 */
export interface FormVo extends VoBean,Omit<FormDto,"fields">  {
  // rules:FormRuleDto[]// 业务规则
  rules:any[]// 业务规则
  // parentsName:string[];//继承和实现的类的名称
  parentForm:FormVo;//当前form模型作为子表它所在的父表信息
  fields: FormFieldVo[]; //字段信息
}

export interface formPageReq{ 
  itemType?:"entity"|"save"|"req"|"vo"|"fk"|"relation"|"bean", //模型类型
  entityType?:string, //关联实体类型
  type?:string,//模型标识
  id?:string,//模型id
  // design?:boolean //当前表单是否处于设计模式
}

/**
 * 指定模型及接口的TS代码
 */
export const tsCode = (entity: string): Promise<Result<string>> => {
  return apiClient.get(`/form/tsCode/${entity}`);
};



/**
 * 模型列表
 */
export const list = (
  req?:formPageReq
  ): Promise<Result<FormVo[]>> => {
    return apiClient.post(`/form/list`,req||{});
};
  
/**
 * 模型分类
 */
export const save = (form: Form): Promise<Result<Form>> => {
  return apiClient.post(`/form/save`, form);
};

/**
 * 模型保存
 */
export const saveFormDto = (dto: Partial<FormDto>): Promise<Result<FormVo>> => {
  return apiClient.post(`/form/save/formDto`, dto);
};

/** 应用归集*/
export const assignType=(dto:BatchModifyDto): Promise<Result<number>>=>{
  return apiClient.post(`/form/assignType`,dto);
};


//---------------待删除---------------------

/**
 * 单个模型
 */
// export const model = (params:formPageReq): Promise<Result<FormVo>> => {
//   return apiClient.get(`/form/model`, { params });
// };

/**
 * 指定模型及接口的TS代码
 */
 export const subForms = ({id}: {id:string}): Promise<Result<FormVo[]>> => {
    return apiClient.get(`/form/subForms/${id}`);
  };
  /**
   * 实体模型列表
   * @returns
   */
  export const entityModels = (params: {
    appId?: string;
  }): Promise<Result<FormVo[]>> => {
  return apiClient.get(`/form/entityModels`,{params});
  };


  /**
 * 未编辑的模型信息
 */
export const models = (uiType: string): Promise<Result<FormVo[]>> => {
  return apiClient.get(`/form/models/${uiType}`);
};


