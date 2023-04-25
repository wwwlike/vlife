package cn.wwwlike.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 销售明细
 */
@Data
@Entity
@Table(name = "erp_order_sale_detail")
public class OrderSaleDetail extends DbEntity {
    /**
     * 销售产品
     */
    public String productId;
    /**
     * 销售单
     */
    public String orderSaleId;

    /**
     * 销售数量
     */
    public Integer total;

    /**
     * 销售单价
     */
    public Double price;

}
