
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 关键指标
export interface ReportKpi extends DbEntity{
  formId: string;  // 所属模块
  reportItemId: string;  // 统计项(分子)
  code: string;  // 指标编码
  reportItemOtherId: string;  // 
  name: string;  // 指标名称
}
// kpi指标项查询条件
export interface ReportKpiPageReq extends PageQuery{
  formId: string;  // 所属模块
  search: string;  // 指标名称
}
/** 
   * 分页查询关键指标;
   * @param req kpi指标项查询条件;
   * @return 关键指标;
   */
export const page=(req: ReportKpiPageReq): Promise<Result<PageVo<ReportKpi>>>=>{
  return apiClient.get(`/reportKpi/page`,{params:req}  );
};
/** 
   * 保存关键指标;
   * @param dto 关键指标;
   * @return 关键指标;
   */
export const save=(dto: ReportKpi): Promise<Result<ReportKpi>>=>{
  return apiClient.post(`/reportKpi/save`   );
};
/** 
   * 明细查询关键指标;
   * @param id 主键id;
   * @return 关键指标;
   */
export const detail=(id: string): Promise<Result<ReportKpi>>=>{
  return apiClient.get(`/reportKpi/detail/${id}`  );
};


/**
 * 指标all
 */
 export const listAll=(): Promise<Result<ReportKpi[]>>=>{
  return apiClient.get(`/reportKpi/list/all`);
};