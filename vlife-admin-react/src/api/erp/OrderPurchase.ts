import {OrderPurchaseDetail} from './OrderPurchaseDetail'
import {PageVo,DbEntity,SaveBean,PageQuery,INo,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 采购单
export interface OrderPurchase extends DbEntity,INo{
  no: string;  // 采购单号
  supplierId: string;  // 供应商
  totalPrice: number;  // 采购总额(元)
  remark: string;  // 备注
  sysUserId: string;  // 采购员
  state: string;  // 订单状态
  orderDate: Date;  // 采购日期
  warehouseId:string;//入库仓库
}
// 采购单据
export interface OrderPurchaseDto extends SaveBean,INo{
  no: string;  // 采购单号
  supplierId: string;  // 供应商
  totalPrice: number;  // 采购总额(元)
  remark: string;  // 备注
  sysUserId: string;  // 采购员
  state: string;  // 订单状态
  orderDate: Date;  // 采购日期
  warehouseId:string;//入库仓库
  details: OrderPurchaseDetail[];  // 采购明细
}
// 采购单查询
export interface OrderPurchasePageReq extends PageQuery{
  orderPurchaseNo: string;  // 订单编号
  supplierId: string;  // 供应商
  sysUser_sysDept_code: string;  // 采购部门
  state: string;  // 订单状态
  sysUserId: string;  // 采购员
  orderDate: Date[];  // 订单日期
  productName: string;  // 采购产品
}
/** 
* 分页查询采购单;
* @param req 采购单查询;
* @return 采购单;
*/
export const page=(req: OrderPurchasePageReq): Promise<Result<PageVo<OrderPurchase>>>=>{
  return apiClient.get(`/orderPurchase/page`,{params:req}  );
};
/** */
export const pageOrderPurchaseDto=(req: OrderPurchasePageReq): Promise<Result<PageVo<OrderPurchaseDto>>>=>{
  return apiClient.get(`/orderPurchase/page/orderPurchaseDto`,{params:req}  );
};
/** 
* 保存采购单;
* @param dto 采购单;
* @return 采购单;
*/
export const save=(dto: OrderPurchase): Promise<Result<OrderPurchase>>=>{
  return apiClient.post(`/orderPurchase/save`,dto  );
};

/** 
* 保存采购单;
* @param dto 采购单;
* @return 采购单;
*/
export const saveOrderPurchaseDto=(dto: OrderPurchaseDto): Promise<Result<OrderPurchaseDto>>=>{
  return apiClient.post(`/orderPurchase/save/orderPurchaseDto`  ,dto  );
};

/** 
* 明细查询采购单;
* @param id 主键id;
* @return 采购单;
*/
export const detail=(id: string): Promise<Result<OrderPurchase>>=>{
  return apiClient.get(`/orderPurchase/detail/${id}`  );
};
/** 
* 逻辑删除;
*/
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/orderPurchase/remove`,{data:ids}  );
};
