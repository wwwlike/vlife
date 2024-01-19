
import {PageVo,DbEntity,Result, PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 发货明细
export interface OrderSendDetail extends DbEntity{
  realNum: number;  // 实发数量
  productId: string;  // 产品
  num: number;  // 应发数量
  warehouseId: string;  // 仓库
  orderSendId: string;  // 销售单
  total: number;  // 发货总额
  price: number;  // 发货单价
}
/** 
   * 分页查询发货明细;
   * @param req ;
   * @return 发货明细;
   */
export const page=(req: PageQuery): Promise<Result<PageVo<OrderSendDetail>>>=>{
  return apiClient.get(`/orderSendDetail/page`,{params:req}  );
};
/** 
   * 保存发货明细;
   * @param orderSendDetail 发货明细;
   * @return 发货明细;
   */
export const save=(orderSendDetail: OrderSendDetail): Promise<Result<OrderSendDetail>>=>{
  return apiClient.post(`/orderSendDetail/save`  ,orderSendDetail  );
};
/** 
   * 明细查询发货明细;
   * @param id 主键id;
   * @return 发货明细;
   */
export const detail=(id: string): Promise<Result<OrderSendDetail>>=>{
  return apiClient.get(`/orderSendDetail/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/orderSendDetail/remove`,{data:ids}  );
};