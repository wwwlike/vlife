package cn.vlife.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Date;

/**
 * 发货单
 */
@Data
@Entity
@Table(name = "erp_order_send")
public class OrderSend extends DbEntity implements INo {
    //发货单号
    public String no;
    // 销售单
    public String orderSaleId;
    //发货日期
    public Date sendDate;
    //发货总额
    public Double  total;
    //发货人
    public String  sysUserId;
    //收货地址
    public String address;
    //发货状态
    @VField(dictCode = "order_send_state")
    public String state;
}
