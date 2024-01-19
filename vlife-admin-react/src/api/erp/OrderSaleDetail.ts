
import {PageVo,DbEntity,Result, PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 销售明细
export interface OrderSaleDetail extends DbEntity{
  orderSaleId: string;  // 销售单
  total: number;  // 销售数量
  productId: string;  // 销售产品
  price: number;  // 销售单价
}
/** 分页查询销售明细*/
export const page=(req?:PageQuery): Promise<Result<PageVo<OrderSaleDetail>>>=>{
  return apiClient.post(`/orderSaleDetail/page`,req||{});
};
/** 销售明细列表*/
export const list=(req?:PageQuery): Promise<Result<OrderSaleDetail[]>>=>{
  return apiClient.post(`/orderSaleDetail/list`,req||{});
};
/** 保存销售明细*/
export const save=(orderSaleDetail:OrderSaleDetail): Promise<Result<OrderSaleDetail>>=>{
  return apiClient.post(`/orderSaleDetail/save`,orderSaleDetail);
};
/** 明细查询销售明细*/
export const detail=(req:{id:string}): Promise<Result<OrderSaleDetail>>=>{
  return apiClient.get(`/orderSaleDetail/detail/${req.id}`);
};
/** 逻辑删除*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/orderSaleDetail/remove`,{data:ids});
};