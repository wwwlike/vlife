
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 联系人
export interface LinkMan extends DbEntity{
  supplierId: string;  // 供应商
  name: string;  // 联系人姓名
  tel: string;  // 联系电话
  remark: string;  // 备注
  job: string;  // 职位
  email: string;  // 邮箱
}
// 联系人查询
export interface LinkManPageReq extends PageQuery{
  search: string;  // 联系人/邮箱/电话
  supplierId: string;  // 供应商
  job: string;  // 职位
}
/** 
   * 分页查询联系人;
   * @param req 联系人查询;
   * @return 联系人;
   */
export const page=(req: LinkManPageReq): Promise<Result<PageVo<LinkMan>>>=>{
  return apiClient.get(`/linkMan/page`,{params:req}  );
};
/** 
   * 保存联系人;
   * @param dto 联系人;
   * @return 联系人;
   */
export const save=(dto: LinkMan): Promise<Result<LinkMan>>=>{
  return apiClient.post(`/linkMan/save`  ,dto  );
};
/** 
   * 明细查询联系人;
   * @param id 主键id;
   * @return 联系人;
   */
export const detail=(id: string): Promise<Result<LinkMan>>=>{
  return apiClient.get(`/linkMan/detail/${id}`  );
};

/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
 export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/linkMan/remove/`,{data:ids}   );
};