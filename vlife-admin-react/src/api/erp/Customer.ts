
import {LinkMan} from './LinkMan'
import {PageVo,DbEntity,SaveBean,PageQuery,VoBean,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 客户
export interface Customer extends DbEntity{
  address: string;  // 客户地址
  remark: string;  // 备注
  bank: string;  // 开户银行
  taxTitle: string;  // 开票抬头
  accountNo: string;  // 银行账号
  name: string;  // 客户名称
  tel: string;  // 电话号码
  sysUserId: string;  // 相关销售
  taxNo: string;  // 纳税人识别号
}
// 客户信息登记
export interface CustomerDto extends SaveBean{
  bank: string;  // 开户银行
  address: string;  // 客户地址
  taxTitle: string;  // 开票抬头
  linkManList: LinkMan[];  // 联系人
  accountNo: string;  // 银行账号
  name: string;  // 客户名称
  remark: string;  // 备注
  tel: string;  // 电话号码
  sysUserId: string;  // 相关销售
  taxNo: string;  // 纳税人识别号
}
// 客户查询
export interface CustomerPageReq extends PageQuery{
  name: string;  // 客户名称
  sysUserId: string;  // 销售负责人
}
// 客户详情
export interface CustomerVo extends VoBean{
  sysUserId: string;  // 销售老大
}
/** 
   * 分页查询客户详情;
   * @param req 客户查询;
   * @return 客户详情;
   */
export const page=(req: CustomerPageReq): Promise<Result<PageVo<Customer>>>=>{
  return apiClient.get(`/customer/page`,{params:req}  );
};
/** 
   * 保存客户信息登记;
   * @param customerDto 客户信息登记;
   * @return 客户信息登记;
   */
export const saveCustomerDto=(customerDto: CustomerDto): Promise<Result<CustomerDto>>=>{
  return apiClient.post(`/customer/save/customerDto`  ,customerDto  );
};
/** 
   * 明细查询客户详情;
   * @param id 主键id;
   * @return 客户详情;
   */
export const detail=(id: string): Promise<Result<CustomerVo>>=>{
  return apiClient.get(`/customer/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/customer/remove`,{params:ids}  );
};