import { ReportKpi } from "./ReportKpi";
import { ReportItem } from "./ReportItem";
import { DbEntity, Result, VoBean } from "../base";
import apiClient from '../base/apiClient';

// 报表明细
export interface ReportTableItem extends DbEntity {
  reportItemId?: string; // 统计项
  reportTableId?: string; // 所属报表
  reportKpiId?: string; // 指标项
  sort: number; // 排序号
  title?: string;
}
// 报表明细项视图
export interface ReportTableItemVo extends VoBean {
  item: ReportItem; // 统计项
  kpi: ReportKpi; // 指标
  sort: number; // 排序号
}
/**
 * 保存报表明细;
 * @param dto 报表明细;
 * @return 报表明细;
 */
export const save = (
  dto: ReportTableItem
): Promise<Result<ReportTableItem>> => {
  return apiClient.post(`/reportTableItem/save`, dto);
};
/**
 * 明细查询报表明细项视图;
 * @param id 主键id;
 * @return 报表明细项视图;
 */
export const detail = (id: string): Promise<Result<ReportTableItemVo>> => {
  return apiClient.get(`/reportTableItem/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/reportTableItem/remove/${id}`);
};
