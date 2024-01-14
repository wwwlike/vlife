package cn.vlife.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Date;

/**
 *入库出库关联表
 */
@Data
@Entity
@Table(name = "erp_order_send_relation")
public class OrderSendRelation extends DbEntity {
    //发货记录
    public String orderSendDetailId;
    //发货数量
    public Integer num;
    //采购明细记录
    public String orderPurchaseDetaidId;
    //采购日期
    //冗余，退货原则后进先退
    public Date purchaseDate;
}
