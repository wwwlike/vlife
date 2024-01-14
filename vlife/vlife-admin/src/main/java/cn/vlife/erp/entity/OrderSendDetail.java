package cn.vlife.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Date;

/**
 * 发货明细
 */
@Data
@Entity
@Table(name = "erp_order_send_detai")
public class OrderSendDetail extends DbEntity {
    // 发货单
    public String orderSendId;
    // 产品
    public String productId;
    // 仓库
    public  String warehouseId;
    //应发数量
    public Integer num;
    //实发数量
    public Integer realNum;
    //发货单价
    public Double price;
    //发货总额
    public Double  total;
    //发货来源
    //节省一张表
    public String productFrom;
}
