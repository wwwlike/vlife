
import {PageVo,DbEntity,SaveBean,PageQuery,VoBean,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 权限组
export interface SysGroup extends DbEntity{
  name: string;  // 角色组名称
  remark: string;  // 描述
  filterType: string;  // 数据维度
}
// 权限组
export interface GroupDto extends SaveBean{
  name: string;  // 组名称
  remark: string;  // 组描述
  sysRoleId: string[];  // 关联角色
  filterType: string;  // 数据维度
}
// 角色组分页查询条件
export interface SysGroupPageReq extends PageQuery{
  name: string;  // 组名称
  sysRoleId: string[];  // 关联角色
}
// 权限组数据对象封装
export interface GroupVo extends VoBean{
  sysRoleGroup_sysRoleId: string[];  // 对应的所有角色id
  sysRoleGroup_sysRole_sysResources_sysMenuId: string[];  // 归属菜单
  sysRoleGroup_sysRole_sysResources_code: string[];  // 权限code
  sysRoleGroup_sysRole_name: string[];  // 权限组关联的角色名称集合
  filterType: string;  //     public Integer scope;
}
/** 权限组列表*/
export const listAll=(): Promise<Result<SysGroup[]>>=>{
  return apiClient.get(`/sysGroup/list/all`);
};
/** 权限组查询*/
export const page=(req:SysGroupPageReq): Promise<Result<PageVo<SysGroup>>>=>{
  return apiClient.post(`/sysGroup/page`,req);
};
/** 权限组保存*/
export const saveGroupDto=(dto:GroupDto): Promise<Result<GroupDto>>=>{
  return apiClient.post(`/sysGroup/save/groupDto`,dto);
};
/** 权限组详情*/
export const detail=(req:{id:string}): Promise<Result<SysGroup>>=>{
  return apiClient.get(`/sysGroup/detail/${req.id}`);
};
/** 删除权限组*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/sysGroup/remove`,{data:ids});
};