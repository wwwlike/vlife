import apiClient from "./apiClient";
import { SysFilterDetail } from "./SysFilterDetail";
import { PageVo, DbEntity, VoBean, Result } from "./base";
// 可过滤的实体主表
export interface SysFilter extends DbEntity {
  entityName: string; // Project
  name: string; // 项目表
}
// 过滤配置主表视图
export interface SysFilterVo extends VoBean {
  entityName: string; // Project
  name: string; // 项目表
  detailList: SysFilterDetail[]; // 可过滤的项目
}
/**
 * 保存可过滤的实体主表;
 * @param dto 可过滤的实体主表;
 * @return 可过滤的实体主表;
 */
export const save = (dto: SysFilter): Promise<Result<SysFilter>> => {
  return apiClient.post(`/sysFilter/save`, { params: dto });
};
/**
 * 明细查询可过滤的实体主表;
 * @param id 主键id;
 * @return 可过滤的实体主表;
 */
export const detail = (id: string): Promise<Result<SysFilter>> => {
  return apiClient.get(`/sysFilter/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysFilter/remove/${id}`);
};

export const initData = (): Promise<Result<void>> => {
  return apiClient.get(`/sysFilter/initData`);
};
