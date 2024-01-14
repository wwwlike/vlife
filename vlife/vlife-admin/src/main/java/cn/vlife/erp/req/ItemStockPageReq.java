package cn.vlife.erp.req;
import cn.vlife.erp.entity.ItemStock;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 库存查询
 */
@Data
public class ItemStockPageReq  extends PageQuery<ItemStock> {
    // 商品
   public String productId ;
    // 所在仓库
   public String warehouseId;
}
