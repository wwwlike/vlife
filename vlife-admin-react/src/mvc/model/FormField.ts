import { Schema } from "@formily/react";
import apiClient from "@src/mvc/apiClient";
import { PageVo, DbEntity, Result, VoBean } from "@src/mvc/base";
import { FormEventDto, FormEventVo } from "./FormEvent";
import { FormReactionVo } from "./FormReaction";

// 列表字段
export interface FormField extends DbEntity {
  formId: string; // 所属表单
  pathName: string; // 全路径
  fieldName: string; // 字段名
  description: string; // 描述
  readOnly: boolean; // 只读
  sort: number; // 顺序
  type: string; // 元素类型
  title: string; // 标题
  required: boolean; // 必填
  initialValues: string; // 默认值
  component: string; // 采用组件
  dictCode: string; // 字典的coden
  dataIndex: string; // formliy里的字段名称，默认一致
  x_decorator: string; // 包裹组件
  x_hidden: boolean; // 隐藏
  disabled: boolean; // 禁用
  fieldType: string; // 字段类型
  x_decorator_props$gridSpan: number; //包裹元素所占grid列数
  x_component_props$placeholder: string; //input填写说明
  x_decorator_props$layout: string; //标签位置
  x_decorator_props$labelAlign: string; //标签对齐方式
  x_validator: string; //校验方式
  vlife_pattern: string; //正则校验
  vlife_message: string; //校验不通过提醒
}

/**
 * 页面组件属性，期待全部干掉
 * 非数据库属性
 */
export interface CustomField {
  labelProps: any; //包装名称层属性
  props: {
    //自定义组件需要的属性
    params?: string[]; //loadData需要监听的属性，名称要修改
    loadData?: (obj?: any) => Promise<Result<any[]>>; //异步取数据promise方法把数据存入data
    // any各组件独有的属性
    datas?: any[]; //元素单个加载时候给的数据
    // syscParams?: string[] //异步的参数名称集合
    // syncDatas?: (obj: any) => Promise<Result<any>> //组件提取时给的数据
  }; //
}
/**
 * 字段属性
 */
export interface FormFieldVo extends VoBean, Schema, CustomField {
  [key: string]: any; // 实现可以赋值任意字段
  formId: string; // 所属表单
  pathName: string; // 全路径
  fieldName: string; // 字段名
  description: string; // 描述
  readOnly: boolean; // 只读
  sort: number; // 顺序
  type: string; // 元素类型
  title: string; // 标题
  required: boolean; // 必填
  initialValues: string; // 默认值
  x_component: string; // 采用组件
  dictCode: string; // 字典的coden
  dataIndex: string; // formliy里的字段名称，默认一致
  x_decorator: string; // 包裹组件
  x_hidden: boolean; // 隐藏
  disabled: boolean; // 禁用
  fieldType: string; // 字段类型
  x_decorator_props$gridSpan: number; //字段所占列数
  x_component_props$placeholder: string; //input填写说明
  x_decorator_props$layout: string; //标签位置
  x_decorator_props$labelAlign: string; //标签对齐方式
  apiKey: string; // 自定义展示组件需要调用的api关键字(名称)，去loadData.ts里换取实际api接口对象
  x_validator: string; //校验方式
  vlife_pattern: string; //正则校验
  vlife_message: string; //校验不通过提醒
  events: FormEventVo[]; //当前field触发的事件
  reactions: FormReactionVo[];
}

/**
 * 保存列表字段;
 * @param dto 列表字段;
 * @return 列表字段;
 */
export const save = (dto: FormField): Promise<Result<FormField>> => {
  return apiClient.post(`/formField/save`, { params: dto });
};
/**
 * 明细查询列表字段;
 * @param id null;
 * @return 列表字段;
 */
export const detail = (id: string): Promise<Result<FormField>> => {
  return apiClient.get(`/formField/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id null;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/formField/remove/${id}`);
};
