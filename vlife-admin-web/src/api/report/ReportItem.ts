
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 报表统计项
export interface ReportItem extends DbEntity{
  formId: string;  // 所在模型
  code: string;  // 统计项编码
  fieldName: string;  // 聚合字段
  formConditionId: string;  // 过滤条件
  havingFilter: string;  // 聚合过滤条件
  func: string;  // 聚合方式
  name: string;  // 统计项名称
}
// 统计项目查询条件
export interface ReportItemPageReq extends PageQuery{
  formId: string;  // 所在模型
  search: string;  // 统计项名称/编码
  func: string;  // 聚合方式
}
/** 
   * 分页查询报表统计项;
   * @param req 统计项目查询条件;
   * @return 报表统计项;
   */
export const page=(req: ReportItemPageReq): Promise<Result<PageVo<ReportItem>>>=>{
  return apiClient.get(`/reportItem/page`,{params:req}  );
};
/** 
   * 保存报表统计项;
   * @param dto 报表统计项;
   * @return 报表统计项;
   */
export const save=(dto: ReportItem): Promise<Result<ReportItem>>=>{
  return apiClient.post(`/reportItem/save`  ,dto  );
};
/** 
   * 明细查询报表统计项;
   * @param id 主键id;
   * @return 报表统计项;
   */
export const detail=(id: string): Promise<Result<ReportItem>>=>{
  return apiClient.get(`/reportItem/detail/${id}`  );
};
/** 
   * 所有统计项
   * @param req
   * @return
   */
export const listAll=(req?: ReportItemPageReq): Promise<Result<ReportItem[]>>=>{
  return apiClient.get(`/reportItem/list/all`,{params:req}  );
};