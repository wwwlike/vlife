import apiClient from "./apiClient";
import { PageVo, DbEntity, PageQuery, VoBean, Result } from "./base";
// 机构
export interface SysOrg extends DbEntity {
  enableDate: Date; // 启用日期
  code: string; // 机构编码
  name: string; // 机构名称
  type: string; // 机构分类
  sysAreaId: string; // 地区
}
// 机构查询条件
export interface SysOrgPageReq extends PageQuery {
  enableDate: Date[]; // 启用日期
  name: string; // 机构名称
  sysAreaId: string; // 地区
  type: string; // 机构分类
}
// 类说明
export interface OrgVo extends VoBean {
  name: string; // 机构名称
}
/**
 * 分页查询null;
 * @param req 机构查询条件;
 * @return null;
 */
export const page = (req: SysOrgPageReq): Promise<Result<PageVo<SysOrg>>> => {
  return apiClient.get(`/sysOrg/page`, { params: req });
};
/**
 * 保存null;
 * @param dto null;
 * @return null;
 */
export const save = (dto: SysOrg): Promise<Result<SysOrg>> => {
  return apiClient.post(`/sysOrg/save`, { params: dto });
};
/**
 * 明细查询null;
 * @param id 主键id;
 * @return null;
 */
export const detail = (id: string): Promise<Result<SysOrg>> => {
  return apiClient.get(`/sysOrg/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysOrg/remove/${id}`);
};

/**
 * 明细查询null;
 * @param id 主键id;
 * @return null;
 */
export const listAll = (params: {
  entityName: string;
}): Promise<Result<SysOrg[]>> => {
  return apiClient.get(`/sysOrg/list/all`, { params: params });
};
