
import {OrderSaleDetail} from './OrderSaleDetail'
import {PageVo,DbEntity,SaveBean,PageQuery,INo,Result, VoBean} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 销售单
export interface OrderSale extends DbEntity,INo{
  no: string;  // 订单编号
  totalPrice: number;  // 销售总额(元)
  remark: string;  // 备注
  customerId: string;  // 客户
  sysUserId: string;  // 销售员
  state: string;  // 订单状态
  orderDate: Date;  // 下单日期
}
// 销售单据
export interface OrderSaleDto extends SaveBean,INo{
  no: string;  // 订单编号
  totalPrice: number;  // 销售总额(元)
  customerId: string;  // 客户
  remark: string;  // 备注
  details: OrderSaleDetail[];  // 销售明细
  sysUserId: string;  // 销售员
  state: string;  // 订单状态
  orderDate: Date;  // 下单日期
}


export interface OrderSaleVo extends VoBean{
  no: string;  // 订单编号
  totalPrice: number;  // 销售总额(元)
  customerId: string;  // 客户
  remark: string;  // 备注
  sysUserId: string;  // 销售员
  state: string;  // 订单状态
  orderDate: Date;  // 下单日期
  customer_name:string;// 客户名称
  details: OrderSaleDetail[];  // 销售明细
  
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
export const page=(req?: OrderSalePageReq): Promise<Result<PageVo<OrderSale>>>=>{
  return apiClient.post(`/orderSale/page`,req||{}  );
};

//销售单列表
export const list=(req?: OrderSalePageReq): Promise<Result<OrderSaleVo[]>>=>{
  return apiClient.post(`/orderSale/list`,req||{}  );
};

export const save=(dto: OrderSale): Promise<Result<OrderSale>>=>{
  return apiClient.post(`/orderSale/save`  ,dto  );
};

/** 
* 保存销售单据
* @param dto 销售单据
* @return 销售单据
*/
export const saveOrderSaleDto=(dto: OrderSaleDto): Promise<Result<OrderSaleDto>>=>{
  return apiClient.post(`/orderSale/save/orderSaleDto`  ,dto  );
};
/** 
* 明细查询销售单;
* @param id 主键id;
* @return 销售单;
*/
export const detail=(id: string): Promise<Result<OrderSaleVo>>=>{
  return apiClient.get(`/orderSale/detail/${id}`  );
};

/** 
* 逻辑删除;
*/
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/orderSale/remove`,{data:ids}  );
};