import apiClient from "./apiClient";
import { PageVo, DbEntity, SaveBean, PageQuery, VoBean, Result } from "./base";
import { SysFilterVo } from "./SysFilter";
// 角色聚合组
export interface SysGroup extends DbEntity {
  name: string; // 角色组名称
  remark: string; // 描述
}
// 角色组dto
export interface GroupDto extends SaveBean {
  name: string; // 组名称
  remark: string; // 组描述
  scope: number;
  sysRoleId: string[]; // 角色集合
}

// 角色组dto
export interface GroupFilterDto extends SaveBean {
  name: string; // 组名称
  filterDetailIds: string[]; // 角色集合
}
// 角色组分页查询条件
export interface SysGroupPageReq extends PageQuery {
  name: string; // 组名称
  sysRoleId: string[]; // 关联角色
}
// 权限组详情
export interface SysGroupDetailVo extends VoBean {
  name: string; // 角色组名称
  remark: string; // 描述
  sysRoleGroup_sysRole_name: string[]; // 包含角色
}
// 权限组数据对象封装
export interface GroupVo extends VoBean {
  sysRoleGroup_sysRoleId: string[]; // 对应的所有角色id
  sysRoleGroup_sysRole_name: string[]; // 权限组关联的角色名称集合
}
/** */
export const page = (
  req: SysGroupPageReq
): Promise<Result<PageVo<SysGroup>>> => {
  return apiClient.get(`/sysGroup/page`, { params: req });
};

/**
 * 保存角色聚合组;
 * @param dto 角色聚合组;
 * @return 角色聚合组;
 */
export const saveGroupDto = (dto: GroupDto): Promise<Result<GroupDto>> => {
  return apiClient.post(`/sysGroup/save/groupDto`, dto);
};

/**
 * 保存角色聚合组;
 * @param dto 角色聚合组;
 * @return 角色聚合组;
 */
export const saveGroupFilterDto = (
  dto: GroupFilterDto
): Promise<Result<GroupFilterDto>> => {
  return apiClient.post(`/sysGroup/save/groupFilterDto`, dto);
};

/**
 * 保存角色聚合组;
 * @param dto 角色聚合组;
 * @return 角色聚合组;
 */
export const save = (dto: SysGroup): Promise<Result<SysGroup>> => {
  return apiClient.post(`/sysGroup/save`, { params: dto });
};
/**
 * 明细查询角色聚合组;
 * @param id 主键id;
 * @return 角色聚合组;
 */
export const detail = (id: string): Promise<Result<SysGroup>> => {
  return apiClient.get(`/sysGroup/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysGroup/remove/${id}`);
};

/**
 *
 * @param id 角色id
 * @returns
 */
export const listSysFilterVo = (
  params: string
): Promise<Result<SysFilterVo[]>> => {
  return apiClient.get(`/sysGroup/list/sysFilterVo`, { params: params });
};
