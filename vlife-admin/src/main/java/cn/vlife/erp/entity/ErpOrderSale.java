// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.Double;
import java.lang.String;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 销售单
 */
@Entity
@Setter
@Table
@VClazz(
    orders = "createDate_desc",
    remove = ErpOrderSaleItem.class,
    unableRm = ErpOrderSaleSend.class
)
public class ErpOrderSale extends DbEntity {
  /**
   * 备注
   */
  public String remark;

  /**
   * 单据号
   */
  public String no;

  /**
   * 订单状态
   */
  public String state;

  /**
   * 销售负责人
   */
  public String sysUserId;

  /**
   * 客户
   */
  public String erpCustomerId;

  /**
   * 订单总金额
   */
  public Double totalPrice;

  /**
   * 销售日期
   */
  public Date orderDate;

  @Column(
      length = 500
  )
  public String getRemark() {
    return this.remark;
  }

  @Column(
      length = 32
  )
  public String getNo() {
    return this.no;
  }

  @Column(
      length = 32
  )
  public String getState() {
    return this.state;
  }

  @Column(
      length = 32
  )
  public String getSysUserId() {
    return this.sysUserId;
  }

  @Column(
      length = 32
  )
  public String getErpCustomerId() {
    return this.erpCustomerId;
  }

  public Double getTotalPrice() {
    return this.totalPrice;
  }

  public Date getOrderDate() {
    return this.orderDate;
  }
}
