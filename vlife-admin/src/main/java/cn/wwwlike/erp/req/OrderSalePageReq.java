package cn.wwwlike.erp.req;

import cn.wwwlike.erp.entity.OrderSale;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 销售单查询
 */
@Data
public class OrderSalePageReq extends PageQuery<OrderSale>{
    /**
     * 订单编号
     */
    @VField(opt = Opt.like)
    public String no;
    /**
     * 客户
     */
    public String customerId;
    /**
     * 订单日期
     */
    public List<Date> orderDate;
    /**
     * 订单产品
     */
    @VField(pathName = "orderSaleDetail_productId")
    public String productName;

}
