package cn.vlife.erp.dto;

import cn.vlife.erp.entity.OrderSale;
import cn.vlife.erp.entity.OrderSaleDetail;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.Date;
import java.util.List;

/**
 * 销售单据
 */
@Data
public class OrderSaleDto implements SaveBean<OrderSale> , INo {
    public String id;
    public String no;
    public String customerId;
    public String sysUserId;
    public Date orderDate;
    public String  state;
    public String remark;
    public Double totalPrice;
    public List<OrderSaleDetail> details;
}
