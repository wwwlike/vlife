package cn.wwwlike.erp.dto;

import cn.wwwlike.erp.entity.OrderSale;
import cn.wwwlike.erp.entity.OrderSaleDetail;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.Date;
import java.util.List;

/**
 * 销售单据
 */
@Data
public class OrderSaleDto implements SaveBean<OrderSale> {
    public String id;
    /**
     * 客户
     */
    public String customerId;
    /**
     * 销售员
     */
    public String sysUserId;
    /**
     * 下单日期
     */
    public Date orderDate;
    /**
     * 订单状态
     */
    @VField(dictCode = "order_state")
    public String  state;
    /**
     * 备注
     */
    public String remark;

    /**
     * 销售总额(元)
     */
    public Double totalPrice;
    /**
     * 销售明细
     */
    public List<OrderSaleDetail> details;
}
