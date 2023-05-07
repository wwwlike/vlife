
import {PageVo,DbEntity,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 销售明细
export interface OrderSaleDetail extends DbEntity{
  orderSaleId: string;  // 销售单
  total: number;  // 销售数量
  productId: string;  // 销售产品
  price: number;  // 销售单价
}
/** 
   * 保存销售明细;
   * @param dto 销售明细;
   * @return 销售明细;
   */
export const saveOrderSale=(dto: OrderSaleDetail): Promise<Result<OrderSaleDetail>>=>{
  return apiClient.post(`/orderSaleDetail/save/orderSale`  ,dto  );
};
/** 
   * 明细查询销售明细;
   * @param id 主键id;
   * @return 销售明细;
   */
export const detail=(id: string): Promise<Result<OrderSaleDetail>>=>{
  return apiClient.get(`/orderSaleDetail/detail/${id}`  );
};