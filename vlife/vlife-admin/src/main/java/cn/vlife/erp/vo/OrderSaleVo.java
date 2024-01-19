package cn.vlife.erp.vo;

import cn.vlife.erp.entity.OrderSale;
import cn.vlife.erp.entity.OrderSaleDetail;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderSaleVo implements VoBean<OrderSale> {
    public String id;
    public String no;
    public String customerId;
    public String sysUserId;
    public Date orderDate;
    public String  state;
    public String remark;
    public Double totalPrice;
    public String customer_name;
    public List<OrderSaleDetail> details;
}