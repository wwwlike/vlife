
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 字典表
export interface SysDict extends DbEntity{
  val?: string;  // 选项值
  code: string;  // 编码
  color: string;  // 颜色代码
  sort: number;  // 排序号
  title: string;  // 选项名
  sys: boolean;  // 系统项
  type: string;  // 字典类型
  level:number;//层级
}
// 类说明
export interface SysDictPageReq extends PageQuery{
  code: string;  // 字典分类
  sys: boolean;  // 系统项
}
/** 字典分页*/
export const page=(req:SysDictPageReq): Promise<Result<PageVo<SysDict>>>=>{
  return apiClient.post(`/sysDict/page`,req);
};
/** 列表查询*/
export const list=(req?:PageQuery): Promise<Result<SysDict[]>>=>{
  return apiClient.post(`/sysDict/list`,req||{});
};
/** 字典编辑*/
export const save=(dto:Partial<SysDict>): Promise<Result<SysDict>>=>{
  return apiClient.post(`/sysDict/save`,dto);
};
/** 字典详情*/
export const detail=(req:{id:string}): Promise<Result<SysDict>>=>{
  return apiClient.get(`/sysDict/detail/${req.id}`);
};
/** 字典删除*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/sysDict/remove`,{data:ids});
};
/** 根据code查询*/
export const listByCode=(req:{code:string}): Promise<Result<SysDict[]>>=>{
return apiClient.get(`/sysDict/listByCode`,{params:req});
};