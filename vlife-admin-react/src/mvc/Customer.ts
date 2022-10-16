import apiClient from "./apiClient";
import { PageVo, DbEntity, PageQuery, Result } from "./base";
// 客户
export interface Customer extends DbEntity {
  address: string; // 联系地址
  linkAreaId: string; // 客户地区
  sysDeptId: string;
  sysAreaId: string;
  linkman: string; // 联系人
  linktel: string; // 联系电话
  sysOrgId: string;
  name: string; // 单位名称
}
// 客户查询
export interface CustomerPageReq extends PageQuery {
  search: string; // 单位名称
}
/**
 * 分页查询客户;
 * @param req 客户查询;
 * @return 客户;
 */
export const page = (
  req: CustomerPageReq
): Promise<Result<PageVo<Customer>>> => {
  return apiClient.get(`/customer/page`, { params: req });
};
/**
 * 保存客户;
 * @param dto 客户;
 * @return 客户;
 */
export const save = (dto: Customer): Promise<Result<Customer>> => {
  return apiClient.post(`/customer/save`, dto);
};
/**
 * 明细查询客户;
 * @param id null;
 * @return 客户;
 */
export const detail = (id: string): Promise<Result<Customer>> => {
  return apiClient.get(`/customer/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id null;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/customer/remove/${id}`);
};
