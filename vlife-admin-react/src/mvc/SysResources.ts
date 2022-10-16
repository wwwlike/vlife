import apiClient from "./apiClient";
import { RoleDto } from "./SysRole";
import { SysRoleGroup } from "./SysRoleGroup";
import { PageVo, DbEntity, SaveBean, PageQuery, VoBean, Result } from "./base";
import qs from "qs";
// 权限资源
export interface SysResources extends DbEntity {
  resourcesCode: string; // 资源编码
  resourcesPcode: string; // 上级权限
  icon: string; // 图标
  sysRoleId: string; // 归属角色
  type: string; // 资源类型
  url: string; // 路由地址
  menuCode: string; // 归属菜单
  name: string; // 资源名称
}
// 类说明
export interface ResourcesDto extends SaveBean {
  sysRole: RoleDto; // 用户角色
  name: string; // 资源名称
  sysRoleId: string; // 归属角色
  sysRole_sysRoleGroup: SysRoleGroup[]; // 角色聚合组
}
// 资源页面
export interface SysResourcesPageReq extends PageQuery {
  search: string; // 名称/编码/地址
  sysRoleId: string; // 接口角色
  type: string; // 资源类型
}
// 类说明
export interface ResourcesVo extends VoBean {
  pcode: string; // 上级权限
  groupIds: string[]; // 资源对应的角色组
  url: string; // 请求路径
}
/**
 * 保存权限资源;
 * @param dto 权限资源;
 * @return 权限资源;
 */
export const save = (dto: SysResources): Promise<Result<SysResources>> => {
  return apiClient.post(`/sysResources/save`, { params: dto });
};

export const saveImport = (
  dto: SysResources
): Promise<Result<SysResources>> => {
  return apiClient.post(`/sysResources/save/import`, dto);
};

/**
 * 明细查询权限资源;
 * @param id 主键id;
 * @return 权限资源;
 */
export const detail = (id: string): Promise<Result<SysResources>> => {
  return apiClient.get(`/sysResources/detail/${id}`);
};
/**
 * 角色应该有的资源权限，因该去掉，交给前端过滤
 * @param sysRoleId
 * @return
 */
export const roleAllResources = (params: {
  id: string;
}): Promise<Result<SysResources[]>> => {
  // console.log("aaa", id);
  return apiClient.get(`/sysResources/roleAllResources/${params.id}`);
};
/**
 * 全量的资源数据
 */
export const listAll = (): Promise<Result<SysResources[]>> => {
  return apiClient.get(`/sysResources/list/all`);
};

/**
 * 全量的菜单资源
 */
export const listMenu = (): Promise<Result<SysResources[]>> => {
  return apiClient.get(`/sysResources/list/menu`);
};

/**
 * 待导入的资源
 */
export const pageImport = (
  req: SysResourcesPageReq
): Promise<Result<PageVo<SysResources>>> => {
  return apiClient.get(
    `/sysResources/page/import?${qs.stringify(req, {
      allowDots: true, //多级对象转str中间加点
      arrayFormat: "comma", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
    })}`
  );
};

/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysResources/remove/${id}`);
};
/** */
export const page = (
  req: SysResourcesPageReq
): Promise<Result<PageVo<SysResources>>> => {
  return apiClient.get(`/sysResources/page`, { params: req });
};
