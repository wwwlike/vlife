import apiClient from "@src/api/base/apiClient";
import { SysResources } from "@src/api/SysResources";
import { PageVo, DbEntity, SaveBean, PageQuery, VoBean, Result } from "@src/api/base";
// 用户角色
export interface SysRole extends DbEntity {
  name: string; // 角色名称
  remark: string; // 描述介绍
  sysMenuId:string//所属应用
}
// 前置请求数据接口，替换请求DbEntity
export interface RoleDto extends SaveBean {
  sysResources_id: string[]; // 绑定权限资源
  sysMenu_id:string[];//菜单
  sysMenuId:string//所属应用
  name: string; // 角色名称
  remark: string; // 描述介绍
  resourcesAndMenuIds:string[];//页面绑定的资源和菜单
}
// 角色查询
export interface SysRolePageReq extends PageQuery {
  vvv: string; // 权限组
  sysMenuId:string//所属应用
  name: string; // 角色名称
}

/**
 * 保存用户角色;
 * @param dto 用户角色;
 * @return 用户角色;
 */
export const save = (dto: SysRole): Promise<Result<SysRole>> => {
  return apiClient.post(`/sysRole/save`, { params: dto });
};
/** */
export const saveRoleDto = (roleDto: RoleDto): Promise<Result<RoleDto>> => {
  return apiClient.post(`/sysRole/save/roleDto`, roleDto);
};
/**
 * 明细查询用户角色;
 * @param id 主键id;
 * @return 用户角色;
 */
export const detail = (id: string): Promise<Result<SysRole>> => {
  return apiClient.get(`/sysRole/detail/${id}`);
};

/** */
export const page = (req: SysRolePageReq): Promise<Result<PageVo<SysRole>>> => {
  return apiClient.get(`/sysRole/page`, { params: req });
};

export const listAll = (): Promise<Result<SysRole[]>> => {
  return apiClient.get(`/sysRole/list/all`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (ids: string[]): Promise<Result<number>> => {
  return apiClient.delete(`/sysRole/remove`,{data:ids});
};
