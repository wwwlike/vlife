package cn.vlife.erp.vo;

import cn.vlife.erp.entity.ItemStock;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

@Data
public class ItemStockVo implements VoBean<ItemStock> {
    public String id;
    public String product_name;
    public String warehouse_name;
    public String productId;
    public String warehouseId;
    public Integer total;
    public Double costPrice;
}
