// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.service;

import cn.vlife.erp.dao.ErpProductTotalDao;
import cn.vlife.erp.entity.ErpOrderPurchaseItem;
import cn.vlife.erp.entity.ErpProductTotal;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ErpProductTotalService extends BaseService<ErpProductTotal, ErpProductTotalDao> {


    /**
     * 采购单入库
     */
    public List<ErpProductTotal> productsIn(List<ErpOrderPurchaseItem> items,String warehouseId){
        return items.stream().map(e->productIn(e,warehouseId)).collect(Collectors.toList());
    }


    /**
     * 查询(创建)指定仓库下指定产品的库存
     */
    private ErpProductTotal warehouseProduct(String warehouseId,String productId){
      QueryWrapper qw=QueryWrapper.of(ErpProductTotal.class).eq("erpWarehouseId",warehouseId).eq("erpProductId",productId);
      List<ErpProductTotal> productTotals=find(qw);
      if(productTotals!=null&&productTotals.size()>0){
        return productTotals.get(0);
      }else{
        ErpProductTotal productTotal=new ErpProductTotal();
        productTotal.setTotalPrice(new Double(0));
        productTotal.setTotalNum(0);
        productTotal.setErpWarehouseId(warehouseId);
        productTotal.setErpProductId(productId);
        return save(productTotal);
      }
    }

    /**
     * 采购产品明细入库
     * @param item
     */
    private ErpProductTotal productIn(ErpOrderPurchaseItem item,String warehouseId){
      ErpProductTotal productTotal=warehouseProduct(warehouseId,item.getErpProductId());
      productTotal.setTotalPrice(productTotal.getTotalPrice()+item.getPrice()*item.getTotal());
      productTotal.setTotalNum(productTotal.getTotalNum()+item.getTotal());
      return save(productTotal);
    }

}
