import { Schema } from "@formily/react";
import apiClient from "@src/api/base/apiClient";
import { DbEntity, PageQuery, Result } from "@src/api/base";
import { FormEventVo } from "./FormEvent";
import { FormReactionVo } from "./FormReaction";
import { DataType } from '@src/dsl/base';
import { PageComponentPropDto } from '@src/api/PageComponentProp';
import { Form } from './Form';

export type javaNumberType="number"|"long"|"double"|"int"|"integer"|"short"|"float";

export type javaType="string"|"boolean"|"date"|"number"|"long"|"double"|"int"|"integer"|"short"|"float";

// 列表字段
export interface FormField extends DbEntity {
  title: string; // 客户端设置标题
  javaTitle: string; //java注释标题
  dataType:DataType ; // 数据类型
  fieldType:"string"|"boolean"|"date"|"number"; // 字段类别
  javaType:javaType;//java类型
  formId: string; // 所属表单
  formGroupCode?: string; //分组code
  formTabCode?: string; //页签code
  pathName: string; // 全路径
  fieldName: string; // 字段名
  entityType: string; //字段实体模型名称
  entityFieldName: string; //数据库模型字段
  // componentType: string; //组件类型（基础组件，业务组件）
  description: string; // 描述
  sort: number; // 顺序
  required: boolean; // 必填
  initialValues: string; // 默认值
  x_component: string; // 采用组件
  dictCode: string; // 字典的coden
  dataIndex: string; // formliy里的字段名称，默认一致
  x_decorator: string; // 包裹组件
  x_hidden: boolean; // 隐藏
  disabled: boolean; // 禁用(待删除)
  readOnly: boolean; // 只读(待删除)
  x_read_pretty:boolean;// 只读 
  x_decorator_props$gridSpan: number; //包裹元素所占grid列数
  x_component_props$placeholder: string; //input填写说明
  x_decorator_props$layout:  "vertical" | "horizontal"| undefined; //标签位置
  x_decorator_props$labelAlign: string; //标签对齐方式
  x_validator: string; //校验方式
  minLength:number;//最小长度
  maxLength:number;//最大长度
  minimum:number;//最小长度
  maximum:number;//最小长度
  vlife_pattern: string; //正则校验
  vlife_message: string; //校验不通过提醒
  componentSettingJson: string; //组件设置的JSON信息（可移除）
  hideLabel:boolean;//隐藏标签
  validate_unique:boolean;//表内唯一
  create_hide:boolean;//新增时隐藏
  modify_read:boolean;//修改时只读
  divider:boolean;//该列之前加入分割线
  dividerLabel:string;//分割线标题
  listHide: boolean; //列表展示
  listWidth:number;//列宽
  money:boolean;//是否金额
  listSort:number;//列排序
  listAlign:string; //对其方式 left|center|right
  safeStr:boolean;//安全展示的字符串（张**）
  listSearch:boolean; //列表的搜索条件模糊搜索
}

// 字段dto
export interface FormFieldDto extends FormField {
  //字段对应组件属性设置信息集合
  pageComponentPropDtos?: Partial<PageComponentPropDto>[];
}

/**
 * 字段模型属性
 */
 export interface FormFieldVo extends FormField, Schema {
  [key: string]: any; // 实现可以赋值任意字段
  form:Form,//所在模型信息
  title: string; // 标题
  //schema里包含字段
  required: boolean; // 必填
  readOnly: boolean; // 只读
  description: string; // 描述
  minLength:number;//最小长度
  maxLength:number;//最大长度
  minimum:number;//最小长度
  maximum:number;//最小长度
  form_type:string;//归属模型标识
  //--- vo注入字段
  events: FormEventVo[]; //当前field触发的事件(后端还没有)
  reactions: FormReactionVo[]; //字段的查询条件
  pageComponentPropDtos?: Partial<PageComponentPropDto>[];
  listWidth:number;//列宽
  money:boolean;//是否金额
  listSort:number;//列排序
  listHide:boolean
  listAlign:"left"|"center"|"right"; //对其方式 left|center|right
  listSearch:boolean; //列表的搜索条件模糊搜索
  safeStr:boolean;//安全展示的字符串（张**）

}

//字段详情
export const detail = (id: string): Promise<Result<FormField>> => {
  return apiClient.get(`/formField/detail/${id}`);
};

/**
 * 模型字段查询
 */
export const listAll = (params?: PageQuery): Promise<Result<FormField[]>> => {
  return apiClient.post(`/formField/list/all`,params||{});
};



/////////////////---------------------待删除
//可分组字段查询
export const listGroupOption = (params: {
  formId: string;
}): Promise<Result<FormField[]>> => {
  return apiClient.get(`/formField/list/groupOption`,{params});
};

/**
  * 主表字段查询
  * 外键字段来源表的所有字段信息
  */
 export const listRelationField = (params: {
  realationFieldId: string;
}): Promise<Result<FormField[]>> => {

  return apiClient.get(`/formField/list/relationField${params.realationFieldId?"?realationFieldId="+params.realationFieldId:""}`);
};
