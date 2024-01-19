
import {OrderSendDetail} from './OrderSendDetail'
import {PageVo,DbEntity,SaveBean,INo,Result, PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 发货单
export interface OrderSend extends DbEntity,INo{
  no: string;  // 发货单号
  orderSaleId: string;  // 销售单
  total: number;  // 发货总额
  address: string;  // 收货地址
  sendDate: Date;  // 发货日期
  sysUserId: string;  // 发货人
  state:string;//发货单状态

}
// 发货单dto
export interface OrderSendDto extends SaveBean,INo{
  no: string;  // 发货单号
  orderSaleId: string;  // 销售单
  total: number;  // 发货总额
  address: string;  // 收货信息
  sendDate: Date;  // 发货日期
  state:string;//发货单状态
  sysUserId: string;  // 发货人
  details: OrderSendDetail[];  // 发货明细
}
/** 
   * 分页查询发货单;
   * @param req ;
   * @return 发货单;
   */
export const page=(req: PageQuery): Promise<Result<PageVo<OrderSend>>>=>{
  return apiClient.get(`/orderSend/page`,{params:req}  );
};
/** 
   * 保存发货单dto;
   * @param orderSendDto 发货单dto;
   * @return 发货单dto;
   */
export const saveOrderSendDto=(orderSendDto: OrderSendDto): Promise<Result<OrderSendDto>>=>{
  return apiClient.post(`/orderSend/save/orderSendDto`  ,orderSendDto  );
};
/** 
   * 明细查询发货单;
   * @param id 主键id;
   * @return 发货单;
   */
export const detail=(id: string): Promise<Result<OrderSend>>=>{
  return apiClient.get(`/orderSend/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/orderSend/remove`,{data:ids}  );
};
/** 
   * 加载销售单对应的发货单
   * 一张销售单对应一张发货单
   * @param orderSaleId
   * @return
   */
export const loadOrderSaleSend=(orderSaleId: string): Promise<Result<OrderSendDto>>=>{
  return apiClient.get(`/orderSend/loadOrderSaleSend/${orderSaleId}`  );
};