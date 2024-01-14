package cn.vlife.erp.vo;

import cn.vlife.erp.entity.ItemStock;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

@Data
public class ItemStockVo implements VoBean<ItemStock> {
    public String id;
    //产品名称
    public String productName;
    //仓库名称
    public String warehouseName;
    // 产品
    public String productId;
    //所在仓库
    public String warehouseId;
    //当前数量
    public Integer total;
    //成本
    public Double costPrice;
}
