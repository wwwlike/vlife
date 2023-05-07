
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 预设过滤条件
export interface FormCondition extends DbEntity{
  formId: string;  // 实体模型id
  name: string;  // 查询名称
  conditionJson: string;  // where查询条件(JSON)
}
// 表单过滤查询条件
export interface FormConditionPageReq extends PageQuery{
  formId: string;  // 实体模型
  search: string;  // 过滤名称
}
/** 
   * 保存预设过滤条件;
   * @param dto 预设过滤条件;
   * @return 预设过滤条件;
   */
export const save=(dto: FormCondition): Promise<Result<FormCondition>>=>{
  return apiClient.post(`/formCondition/save`  ,dto  );
};
/** 
   * 明细查询预设过滤条件;
   * @param id 主键id;
   * @return 预设过滤条件;
   */
export const detail=(id: string): Promise<Result<FormCondition>>=>{
  return apiClient.get(`/formCondition/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/formCondition/remove/${id}`  );
};
/** 
   * 过滤条件分页查询
   */
export const page=(req: FormConditionPageReq): Promise<Result<PageVo<FormCondition>>>=>{
  return apiClient.get(`/formCondition/page`,{params:req}  );
};
/** 
   * 所有过滤条件
   */
export const listAll=(req: FormConditionPageReq): Promise<Result<FormCondition[]>>=>{
  return apiClient.get(`/formCondition/list/all`,{params:req}  );
};