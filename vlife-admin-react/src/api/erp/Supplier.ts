import {LinkMan} from '@src/api/erp/LinkMan'
import {PageVo,DbEntity,SaveBean,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 供应商
export interface Supplier extends DbEntity{
  bank: string;  // 开户银行
  address: string;  // 详细地址
  name: string;  // 供应商名称
  type: string;  // 供应商类别
  cardNo: string;  // 银行账号
  account: string;  // 收款账户户名
}
// 供应商信息登记
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
   * 保存供应商&联系人集合dto;
   * @param dto 供应商&联系人集合dto;
   * @return 供应商&联系人集合dto;
   */
export const saveSupplierDto=(dto: SupplierDto): Promise<Result<SupplierDto>>=>{
  return apiClient.post(`/supplier/save/supplierDto`  ,dto  );
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
 export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/supplier/remove/`,{data:ids}   );
};

