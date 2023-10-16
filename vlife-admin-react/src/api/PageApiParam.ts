
import apiClient from '@src/api/base/apiClient'
import {DbEntity,Result} from '@src/api/base'
// 组件API参数设置
export interface PageApiParam extends DbEntity{
  pageComponentPropId: string;  // 组件属性
  sourceType: string;  // 参数值来源
  paramVal: any;  // 参数值
  paramName: string;  // 参数名称
}
/** 
   * 保存API参数;
   * @param dto API参数;
   * @return API参数;
   */
export const saveApiParam=(dto: PageApiParam): Promise<Result<PageApiParam>>=>{
  return apiClient.post(`/pageApiParam/save/apiParam`  ,dto  );
};
/** 
   * 明细查询API参数;
   * @param id 主键id;
   * @return API参数;
   */
export const detail=(id: string): Promise<Result<PageApiParam>>=>{
  return apiClient.get(`/pageApiParam/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/pageApiParam/remove/${id}`  );
};