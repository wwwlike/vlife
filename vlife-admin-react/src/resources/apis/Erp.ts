import { ItemStock, ItemStockVo, list as itemStockList } from '@src/api/erp/ItemStock';
import { list as orderSaleList, OrderSale, OrderSaleVo } from '@src/api/erp/OrderSale';
import { list as productList, Product} from '@src/api/erp/Product';
import { ApiInfo } from '@src/components/compConf/compConf';
import { DataModel, DataType } from '@src/dsl/base';
import { ISelect } from '@src/dsl/component';
import { formatDate } from '@src/util/func';

/**
 * Erp定义文件
 */
export const productOpenApi:ApiInfo={
  label:"产品",
  api:productList,
  dataType:DataType.array,
  dataModel:"product",
  match:{
    SALE_ISelect:{
      dataType:DataType.array,
      dataModel:"ISelect",
      params:{
        //子查询通过销售单号查询
        orderSaleDetail_orderSaleId:{
          label:"销售单ID",
          dataType:DataType.basic,
          dataModel:DataModel.string,
          fromField:{entity:"orderSale",field:"id"},
          required:true
        }
      },
      func(product:Product[]):ISelect[]{
        return product.map(p=>{return{value:p.id,label:p.name}});
      }
    }
  }
}


export const stockItemOpenApi:ApiInfo={
  label:"库存",
  api:itemStockList,
  dataType:DataType.array,
  dataModel:"product",
  match:{
    //库存数量下拉选择
    wareHouse_total_ISelect:{
      label:"仓库",
      dataType:DataType.array,
      dataModel:"ISelect",
      params:{
        productId:{
          label:"产品id",
          dataType:DataType.basic,
          dataModel:DataModel.string,
          fromField:{entity:"product",field:"id"},
          required:true
        }
      },
      func(itemStock:ItemStockVo[]):ISelect[]{
        return itemStock.map(p=>{return{value:p.warehouseId,label:`${p.warehouse_name}(${p.total})`}});
      }
    }
  }
}

//销售单
export const orderSaleOpenApi:ApiInfo={
  label:"销售单",
  api:orderSaleList,
  dataType:DataType.array,
  dataModel:"orderSaleVo",
  filters:{
    paid:{
      title:"已收款",
      func:(orderSale:OrderSale[])=>{
        return orderSale.filter(f=>f.state==="2");
      }
    },
    send:{
      title:"发货中",
      func:(orderSale:OrderSale[])=>{
        return orderSale.filter(f=>f.state==="3");
      }
    }
  },
  match:{
   ISelect:{
    dataType:DataType.array,
    dataModel:"ISelect",
    func:(orderSale:OrderSaleVo[]):ISelect[]=>{
      return orderSale.map(p=>{return {value:p.id,label:`${p.no}-(${p.customer_name}/ ${formatDate(p.orderDate, "yyyy/MM/dd")  })`}})
     }
   }
 }
}
