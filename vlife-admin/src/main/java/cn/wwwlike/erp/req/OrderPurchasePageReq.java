package cn.wwwlike.erp.req;

import cn.wwwlike.erp.entity.OrderPurchase;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 采购单查询
 */
@Data
public class OrderPurchasePageReq extends PageQuery<OrderPurchase> {
    /**
     * 订单编号
     */
    @VField(opt = Opt.like)
    public String orderPurchaseNo;
    /**
     * 供应商
     */
    public String supplierId;
    /**
     * 采购部门
     */
    public String sysUser_sysDept_code;
    /**
     * 订单日期
     */
    public List<Date> orderDate;

    @VField(pathName = "orderPurchaseDetail_productId")
    public String productName;
    /**
     * 采购员
     */
    public String sysUserId;

}
