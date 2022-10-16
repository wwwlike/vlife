import apiClient from "./apiClient";
import { PageVo, DbEntity, PageQuery, Result } from "./base";
// 字典表
export interface SysDict extends DbEntity {
  val: string | undefined; // 选项值
  code: string; // 编码
  edit: boolean; // 可维护
  title: string; // 选项名
  sys: boolean; // 系统项
}
// 类说明
export interface SysDictPageReq extends PageQuery {
  code: string; // 编码
  title: string; // 名称
  sys: boolean; // 系统项
  queryType: boolean; // 跳过检查
}
/** */
export const page = (req: SysDictPageReq): Promise<Result<PageVo<SysDict>>> => {
  return apiClient.get(`/sysDict/page`, { params: req });
};
/** */
export const all = (): Promise<Result<SysDict[]>> => {
  return apiClient.get(`/sysDict/all`);
};
/**
 * 保存字典表;
 * @param dto 字典表;
 * @return 字典表;
 */
export const save = (dto: SysDict): Promise<Result<SysDict>> => {
  return apiClient.post(`/sysDict/save`, { params: dto });
};
/**
 * 明细查询字典表;
 * @param id 主键id;
 * @return 字典表;
 */
export const detail = (id: string): Promise<Result<SysDict>> => {
  return apiClient.get(`/sysDict/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysDict/remove/${id}`);
};
/** */
export const sync = (): Promise<Result<SysDict[]>> => {
  return apiClient.get(`/sysDict/sync`);
};
