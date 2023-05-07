
import {LinkMan} from '@src/api/LinkMan'
import {PageVo,DbEntity,SaveBean,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 客户
export interface Customer extends DbEntity{
  address: string;  // 客户地址
  remark: string;  // 备注
  bank: string;  // 开户银行
  taxTitle: string;  // 开票抬头
  accountNo: string;  // 银行账号
  name: string;  // 客户名称
  sallMan: string;  // 相关销售
  tel: string;  // 电话号码
  taxNo: string;  // 纳税人识别号
  customerNo: string;  // 编号
}
// 客户信息登记
export interface CustomerDto extends SaveBean{
  bank: string;  // 开户银行
  address: string;  // 客户地址
  taxTitle: string;  // 开票抬头
  linkManList: LinkMan[];  // 联系人
  accountNo: string;  // 银行账号
  name: string;  // 客户名称
  sallMan: string;  // 相关销售
  remark: string;  // 备注
  tel: string;  // 电话号码
  taxNo: string;  // 纳税人识别号
  customerNo: string;  // 编号
}
// 客户查询
export interface CustomerPageReq extends PageQuery{
  name: string;  // 客户名称
  sallMan: string;  // 相关销售
}
/** 
   * 分页查询客户;
   * @param req 客户查询;
   * @return 客户;
   */
export const page=(req: CustomerPageReq): Promise<Result<PageVo<Customer>>>=>{
  return apiClient.get(`/customer/page`,{params:req}  );
};
/** 
   * 保存客户信息登记;
   * @param dto 客户信息登记;
   * @return 客户信息登记;
   */
export const saveCustomerDto=(dto: CustomerDto): Promise<Result<CustomerDto>>=>{
  return apiClient.post(`/customer/save/customerDto`  ,dto  );
};

export const save=(dto: Customer): Promise<Result<Customer>>=>{
  return apiClient.post(`/customer/save`  ,dto  );
};
/** 
   * 明细查询客户;
   * @param id 主键id;
   * @return 客户;
   */
export const detail=(id: string): Promise<Result<Customer>>=>{
  return apiClient.get(`/customer/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/customer/remove/${id}`  );
};