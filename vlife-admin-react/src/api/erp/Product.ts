
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 产品
export interface Product extends DbEntity{
  remark: string;  // 备注
  title: string;  // 数据标题
  xh: string;  // 规格型号
  unit: string;  // 计量单位
  name: string;  // 产品名称
  brand: string;  // 产品品牌
  productNo: string;  // 产品编号
}
// 产品查询
export interface ProductPageReq extends PageQuery{
  name: string;  // 产品名/编号
  brand: string[];  // 产品品牌
}
/** 
   * 分页查询产品;
   * @param req 产品查询;
   * @return 产品;
   */
export const page=(req?: ProductPageReq): Promise<Result<PageVo<Product>>>=>{
  return apiClient.post(`/product/page`,req||{}  );
};


//产品列表
 export const list=(req?: ProductPageReq): Promise<Result<Product[]>>=>{
  return apiClient.post(`/product/list`,req||{}  );
};
/** 
   * 保存产品;
   * @param dto 产品;
   * @return 产品;
   */
export const save=(dto: Product): Promise<Result<Product>>=>{
  return apiClient.post(`/product/save`  ,dto  );
};
/** 
   * 明细查询产品;
   * @param id 主键id;
   * @return 产品;
   */
export const detail=(id: string): Promise<Result<Product>>=>{
  return apiClient.get(`/product/detail/${id}`  );
};

/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
 export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/product/remove/`,{data:ids}   );
};

