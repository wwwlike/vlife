
import {PageVo,DbEntity,PageQuery,VoBean,Result} from '@src/api/base'
import apiClient,{stringify} from '@src/api/base/apiClient'
// 商品库存
export interface ItemStock extends DbEntity{
  total: number;  // 当前数量
  productId: string;  //  产品
  warehouseId: string;  // 所在仓库
  costPrice: number;  // 当前成本
}
// 库存查询
export interface ItemStockPageReq extends PageQuery{
  productId: string;  //  商品
  warehouseId: string;  //  所在仓库
}
export interface ItemStockVo extends VoBean{
  total: number;  // 当前数量
  warehouse_name: string;  // 仓库名称
  productId: string;  //  产品
  warehouseId: string;  // 所在仓库
  costPrice: number;  // 当前成本
  product_name: string;  // 标题
}
/** 分页查询商品库存*/
export const page=(req:ItemStockPageReq): Promise<Result<PageVo<ItemStock>>>=>{
  return apiClient.post(`/itemStock/page`,req);
};
/** 列表查询商品库存*/
export const list=(req:ItemStockPageReq): Promise<Result<ItemStockVo[]>>=>{
  return apiClient.post(`/itemStock/list`,req);
};
/** 保存商品库存*/
export const save=(itemStock:ItemStock): Promise<Result<ItemStock>>=>{
  return apiClient.post(`/itemStock/save`,itemStock);
};
/** 明细查询商品库存*/
export const detail=(req:{id:string}): Promise<Result<ItemStock>>=>{
  return apiClient.get(`/itemStock/detail/${req.id}`);
};
/** 逻辑删除*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/itemStock/remove`,{data:ids});
};