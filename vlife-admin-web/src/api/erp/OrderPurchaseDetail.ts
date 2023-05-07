
import {PageVo,DbEntity,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 采购明细
export interface OrderPurchaseDetail extends DbEntity{
  total: number;  // 采购数量
  productId: string;  // 采购产品
  price: number;  // 采购单价
  orderPurchaseId: string;  // 采购单
}
