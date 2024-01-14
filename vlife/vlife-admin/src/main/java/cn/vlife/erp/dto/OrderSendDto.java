package cn.vlife.erp.dto;

import cn.vlife.erp.entity.OrderSend;
import cn.vlife.erp.entity.OrderSendDetail;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.sql.Date;
import java.util.List;

/**
 * 发货单据
 */
@Data
public class OrderSendDto  implements SaveBean<OrderSend>, INo {
    public String id;
    public String no;
    public String orderSaleId;
    public Date sendDate;
    public Double  total;
    public String  sysUserId;
    public String address;
    public String state;
    public List<OrderSendDetail> details;
}
