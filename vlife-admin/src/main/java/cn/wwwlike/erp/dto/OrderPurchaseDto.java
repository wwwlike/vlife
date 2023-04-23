package cn.wwwlike.erp.dto;

import cn.wwwlike.erp.entity.OrderPurchase;
import cn.wwwlike.erp.entity.OrderPurchaseDetail;
import cn.wwwlike.erp.entity.Product;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 采购单据
 */
@Data
public class OrderPurchaseDto implements SaveBean<OrderPurchase>, INo {
    public String id;
    /**
     * 采购单号
     */
    public String no;
    /**
     * 供应商
     */
    public String supplierId;
    /**
     * 采购日期
     */
    public Date orderDate;
    /**
     * 采购员
     */
    public String sysUserId;
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
     * 采购总额(元)
     */
    public Double totalPrice;

    /**
     * 采购明细
     */
    public List<OrderPurchaseDetail> details;
}
