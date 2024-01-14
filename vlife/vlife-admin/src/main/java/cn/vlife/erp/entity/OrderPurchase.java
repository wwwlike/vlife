package cn.vlife.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 采购单
 */
@Data
@Entity
@Table(name = "erp_order_purchase")
public class OrderPurchase extends DbEntity implements INo {
    /**
     * 采购单号
     */
    public String no;
    /**
     * 供应商
     */
    public String supplierId;
    /**
     * 采购员
     */
    public String sysUserId;
    /**
     * 采购日期
     */
    public Date orderDate;
    /**
     * 采购单状态
     */
    @VField(dictCode = "order_purchase_state")
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
     * 入库仓库
     */
    public String warehouseId;


}
