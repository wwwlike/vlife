package cn.vlife.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 商品库存
 */
@Data
@Entity
@Table(name = "erp_item_stock")
public class ItemStock extends DbEntity {
    // 产品
    public String productId;
    //所在仓库
    public String warehouseId;
    //当前数量
    public Integer total;
    //当前成本
    public Double costPrice;
}
