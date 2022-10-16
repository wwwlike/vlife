import apiClient from "./apiClient";
import { SysResources } from "./SysResources";
import { PageVo, DbEntity, SaveBean, PageQuery, VoBean, Result } from "./base";
// 用户角色
export interface SysRole extends DbEntity {
  name: string; // 角色名称
  remark: string; // 描述介绍
}
// 前置请求数据接口，替换请求DbEntity
export interface RoleDto extends SaveBean {
  sysResources_id: string[]; // 绑定权限资源
  name: string; // 角色名称
  remark: string; // 描述介绍
}
// 角色查询
export interface SysRolePageReq extends PageQuery {
  vvv: string; // 权限组
  name: string; // 角色名称
}
// 取到编辑页面展示的数据
export interface RoleEditVo extends VoBean {
  name: string; // 角色名称
  resources: SysResources[]; // 资源信息
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
export const saveRoleDto = (dto: RoleDto): Promise<Result<RoleDto>> => {
  return apiClient.post(`/sysRole/save/roleDto`, { params: dto });
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
export const detailRoleEditVo = (id: string): Promise<Result<RoleEditVo>> => {
  return apiClient.get(`/sysRole/detail/roleEditVo/${id}`);
};
/** */
export const page = (req: SysRolePageReq): Promise<Result<PageVo<SysRole>>> => {
  return apiClient.get(`/sysRole/page`, { params: req });
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysRole/remove/${id}`);
};
