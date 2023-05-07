
import {OrderSaleDetail} from '@src/api/erp/OrderSaleDetail'
import {PageVo,DbEntity,SaveBean,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 销售单
export interface OrderSale extends DbEntity{
  no: string;  // 订单编号
  totalPrice: number;  // 销售总额(元)
  remark: string;  // 备注
  customerId: string;  // 客户
  sysUserId: string;  // 销售员
  state: string;  // 订单状态
  orderDate: Date;  // 下单日期
}
// 销售单据
export interface OrderSaleDto extends SaveBean{
  no: string;  // 订单编号
  totalPrice: number;  // 销售总额(元)
  customerId: string;  // 客户
  remark: string;  // 备注
  details: OrderSaleDetail[];  // 销售明细
  sysUserId: string;  // 销售员
  state: string;  // 订单状态
  orderDate: Date;  // 下单日期
}
// 销售单查询
export interface OrderSalePageReq extends PageQuery{
  no: string;  // 订单编号
  customerId: string;  // 客户
  orderDate: Date[];  // 订单日期
  productName: string;  // 订单产品
}
/** 
   * 分页查询销售单;
   * @param req 销售单查询;
   * @return 销售单;
   */
export const page=(req: OrderSalePageReq): Promise<Result<PageVo<OrderSale>>>=>{
  return apiClient.get(`/orderSale/page`,{params:req}  );
};
/** 
   * 保存销售单据;
   * @param dto 销售单据;
   * @return 销售单据;
   */
export const saveOrderSaleDto=(dto: OrderSaleDto): Promise<Result<OrderSaleDto>>=>{
  return apiClient.post(`/orderSale/save/orderSaleDto`  ,dto  );
};
/** 
   * 明细查询销售单;
   * @param id 主键id;
   * @return 销售单;
   */
export const detail=(id: string): Promise<Result<OrderSale>>=>{
  return apiClient.get(`/orderSale/detail/${id}`  );
};