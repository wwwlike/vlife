
import {PageVo,DbEntity,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 采购明细
export interface OrderPurchaseDetail extends DbEntity{
  total: number;  // 采购数量
  productId: string;  // 采购产品
  price: number;  // 采购单价
  orderPurchaseId: string;  // 采购单
  stockTotal:number;//库存数量
}
/** 
   * 明细查询采购单;
   * @param id 主键id;
   * @return 采购单;
   */
export const detail=(id: string): Promise<Result<OrderPurchaseDetail>>=>{
  return apiClient.get(`/orderPurchaseDetail/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
 export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/orderPurchaseDetail/remove/`,{data:ids}   );
};