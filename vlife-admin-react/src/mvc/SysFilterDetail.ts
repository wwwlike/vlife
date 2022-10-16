import apiClient from "./apiClient";
import { PageVo, DbEntity, Result, VoBean } from "./base";
// 可过滤的项目
export interface SysFilterDetail extends DbEntity {
  // Project  //数据过滤的类型1本级 2本级下级，3本级和上级
  type: string; // 过滤方式
  // fieldName: string; // 过滤字段sysOrgId
  scope: number;
  name: string; // 查看用户所在机构和下级机构的项目
  sysFilterId: string; // 所属分类
}
export interface FilterDetailCompVo extends VoBean {
  label: string;
  value: string;
  scope: number;
}

/**
 * 保存可过滤的项目;
 * @param dto 可过滤的项目;
 * @return 可过滤的项目;
 */
export const saveSysFilter = (
  dto: SysFilterDetail
): Promise<Result<SysFilterDetail>> => {
  return apiClient.post(`/sysFilterDetail/save/sysFilter`, { params: dto });
};
/**
 * 明细查询可过滤的项目;
 * @param id 主键id;
 * @return 可过滤的项目;
 */
export const detail = (id: string): Promise<Result<SysFilterDetail>> => {
  return apiClient.get(`/sysFilterDetail/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysFilterDetail/remove/${id}`);
};
