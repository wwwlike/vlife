
import {LinkMan} from './LinkMan'
import {PageVo,DbEntity,SaveBean,PageQuery,Result} from './base'
import apiClient from './base/apiClient'
// 供应商
export interface Supplier extends DbEntity{
  bank: string;  // 开户银行
  address: string;  // 详细地址
  name: string;  // 供应商名称
  type: string;  // 供应商类别
  cardNo: string;  // 银行账号
  account: string;  // 收款账户户名
}
// 供应商&联系人集合dto
export interface SupplierDto extends SaveBean{
  bank: string;  // 开户银行
  address: string;  // 详细地址
  linkManList: LinkMan[];  // 联系人
  name: string;  // 供应商名称
  type: string;  // 供应商类别
  cardNo: string;  // 银行账号
  account: string;  // 收款账户户名
}
// 供应商查询
export interface SupplierPageReq extends PageQuery{
  name: string;  // 供应商名称
  type: string[];  // 供应商类别
}
/** 
   * 分页查询供应商;
   * @param req 供应商查询;
   * @return 供应商;
   */
export const page=(req: SupplierPageReq): Promise<Result<PageVo<Supplier>>>=>{
  return apiClient.get(`/supplier/page`,{params:req}  );
};
/** 
   * 保存供应商;
   * @param dto 供应商;
   * @return 供应商;
   */
export const save=(dto: Supplier): Promise<Result<Supplier>>=>{
  return apiClient.post(`/supplier/save`  ,dto  );
};
/** 
   * 明细查询供应商;
   * @param id 主键id;
   * @return 供应商;
   */
export const detail=(id: string): Promise<Result<Supplier>>=>{
  return apiClient.get(`/supplier/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/supplier/remove/${id}`  );
};