
import {PageVo,DbEntity,Result, PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 甲方客户
export interface DemoCustomer extends DbEntity{
  name: string;  // 客户名称
}
/** 
   * 分页查询甲方客户;
   * @param req ;
   * @return 甲方客户;
   */
export const list=(req: PageQuery): Promise<Result<DemoCustomer[]>>=>{
  return apiClient.get(`/demoCustomer/list`,{params:req}  );
};
/** 
   * 保存甲方客户;
   * @param demoCustomer 甲方客户;
   * @return 甲方客户;
   */
export const save=(demoCustomer: DemoCustomer): Promise<Result<DemoCustomer>>=>{
  return apiClient.post(`/demoCustomer/save`  ,demoCustomer  );
};
/** 
   * 明细查询甲方客户;
   * @param id 主键id;
   * @return 甲方客户;
   */
export const detail=(id: string): Promise<Result<DemoCustomer>>=>{
  return apiClient.get(`/demoCustomer/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/demoCustomer/remove`,{data:ids}  );
};