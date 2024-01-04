
import apiClient from '@src/api/base/apiClient'
import { sourceType } from '@src/dsl/base';
import {DbEntity,Result, SaveBean} from '@src/api/base'
import { PageApiParam } from '@src/api/PageApiParam';
// 组件属性
export interface PageComponentProp extends DbEntity{
  pageComponentId: string;  // 所属组件
  formFieldId:string;//所在字段
  sourceType: string;  // 属性值来源
  propVal: string;  // 属性值
  propName: string;  // 属性名称
  relateVal:string;// 数据转换key
  listNo:number; //排序号
  subName:string;//子属性
  filterFunc:string;//数据过滤函数key
  filterConnectionType:String;//数据过滤的连接方式 and /or
}


export interface PageComponentPropDto extends SaveBean{
  pageComponentId: string;  // 所属组件
  formFieldId:string;//所在字段
  sourceType: sourceType;  // 属性值来源
  propVal: any;  // 属性值
  propName: string;  // 属性名称
  listNo:number; //排序号
  subName:string;//子属性
  params?:Partial<PageApiParam>[]; //属性外键表参数设置
  relateVal?:string;// 数据转换key
  filterFunc?:string;//数据过滤函数key
  filterConnectionType?:String;//数据过滤的连接方式 and /or
}


/** 
   * 保存组件属性;
   * @param dto 组件属性;
   * @return 组件属性;
   */
export const saveComponentProp=(dto: PageComponentProp): Promise<Result<PageComponentProp>>=>{
  return apiClient.post(`/pageComponentProp/save/componentProp`  ,dto  );
};
/** 
   * 明细查询组件属性;
   * @param id 主键id;
   * @return 组件属性;
   */
export const detail=(id: string): Promise<Result<PageComponentProp>>=>{
  return apiClient.get(`/pageComponentProp/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/pageComponentProp/remove/${id}`  );
};