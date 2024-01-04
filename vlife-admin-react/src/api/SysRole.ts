
import {PageVo,DbEntity,SaveBean,PageQuery,Result} from '@src/api/base'
import apiClient,{stringify} from '@src/api/base/apiClient'
// 用户角色
export interface SysRole extends DbEntity{
  sysMenuId: string;  // 所在应用
  name: string;  // 角色名称
  remark: string;  // 描述介绍
}
// 角色dto
export interface RoleDto extends SaveBean{
  resourcesAndMenuIds: string[];  // 关联权限
  sysResources_id: string[];  // 接口
  sysMenu_id: string[];  // 菜单
  sysMenuId: string;  // 应用
  name: string;  // 角色名称
  remark: string;  // 描述介绍
}
// 角色查询
export interface SysRolePageReq extends PageQuery{
  vvv: string;  // 权限组
  sysMenuId: string;  // 所在应用
  name: string;  // 角色名称
}
/** 角色保存*/
export const saveRoleDto=(dto:RoleDto): Promise<Result<RoleDto>>=>{
  return apiClient.post(`/sysRole/save/roleDto`,dto);
};
/** 角色详情*/
export const detail=(req:{id:string}): Promise<Result<SysRole>>=>{
  return apiClient.get(`/sysRole/detail/${req.id}`);
};
/** 角色查询*/
export const page=(req:SysRolePageReq): Promise<Result<PageVo<SysRole>>>=>{
  return apiClient.post(`/sysRole/page`,req);
};
/** 角色列表*/
export const listAll=(): Promise<Result<SysRole[]>>=>{
  return apiClient.get(`/sysRole/list/all`);
};
/** 角色删除*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/sysRole/remove`,{data:ids});
};