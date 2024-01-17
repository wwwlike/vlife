package cn.vlife.erp.dto;

import cn.vlife.erp.entity.OrderPurchase;
import cn.vlife.erp.entity.OrderPurchaseDetail;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.Date;
import java.util.List;

/**
 * 采购单据
 */
@Data
@VClazz(orders = "state_asc,orderDate_desc")
public class OrderPurchaseDto implements SaveBean<OrderPurchase>, INo {
    public String id;
    public String no;
    public String supplierId;
    public Date orderDate;
    public String sysUserId;
    public String  state;
    public String remark;
    public Double totalPrice;
    public String warehouseId;
    public List<OrderPurchaseDetail> details;
}
