
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 视图配置
export interface ReportCondition extends DbEntity{
  sysMenuId: string;  // 应用
  formId: string;  // 数据集
  name: string;  // 查询名称
  conditionJson: string;  // 查询条件
  sysUserId: string;  // 视图创建用户
  type:string;// 视图使用场景 table/report
}
// 视图配置查询条件
export interface ReportConditionPageReq extends PageQuery{
  formId: string;  // 数据集
  search: string;  // 查询名称
  type:string;//使用场景
}
/** 
* 分页查询视图配置;
* @param req 视图配置查询条件;
* @return 视图配置;
*/
export const page=(req:Partial<ReportConditionPageReq>): Promise<Result<PageVo<ReportCondition>>>=>{
  return apiClient.get(`/reportCondition/page`,{params:req}  );
};
/** 
* 数据集查询
*/
export const list=(req?:Partial<ReportConditionPageReq>): Promise<Result<ReportCondition[]>>=>{
  return apiClient.post(`/reportCondition/list`,req );
};
/** 
* 保存视图配置;
* @param reportCondition 视图配置;
* @return 视图配置;
*/
export const save=(reportCondition: ReportCondition): Promise<Result<ReportCondition>>=>{
  return apiClient.post(`/reportCondition/save`  ,reportCondition  );
};
/** 
* 明细查询视图配置;
* @param id 主键id;
* @return 视图配置;
*/
export const detail=(req:{id: string}): Promise<Result<ReportCondition>>=>{
  return apiClient.get(`/reportCondition/detail/${req.id}`  );
};
/** 
* 逻辑删除;
* @param ids 主键id;
* @return 已删除数量;
*/
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/reportCondition/remove`,{data:ids}  );
};