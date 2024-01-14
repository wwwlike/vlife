
import {PageVo,DbEntity,SaveBean,PageQuery,ITree,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 科室部门
export interface SysDept extends DbEntity,ITree{
  code: string;  // 编码
  pcode: string;  // 上级部门
  name: string;  // 部门名称
  parentId: string;  // 上级部门id
}

export interface SysDeptUserDto extends SaveBean,ITree{
  sysUser_id: string[];  // 用户
  code: string;  // 编码
  pcode: string;  // 上级部门
  name: string;  // 部门名称
}
// 部门查询条件
export interface SysDeptPageReq extends PageQuery{
  code: string;  // 部门结构
  name: string;  // 部门名称
}
/** 部门查询*/
export const page=(req: SysDeptPageReq): Promise<Result<PageVo<SysDept>>>=>{
  return apiClient.post(`/sysDept/page`  ,req  );
};
/** 部门保存*/
export const save=(dto: SysDept): Promise<Result<SysDept>>=>{
  return apiClient.post(`/sysDept/save`  ,dto  );
};
/** 所有部门*/
export const list=(req?:PageQuery): Promise<Result<SysDept[]>>=>{
  return apiClient.post(`/sysDept/list` ,req||{} );
};
/** 部门详情*/
export const detail=(req:{id: string}): Promise<Result<SysDept>>=>{
  return apiClient.get(`/sysDept/detail/${req.id}`  );
};
/** 删除部门*/
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/sysDept/remove`,{data:ids}  );
};