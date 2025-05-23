// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.Double;
import java.lang.String;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 采购单
 */
@Entity
@Setter
@Table
public class ErpOrderPurchase extends DbEntity {
  /**
   * 订单日期
   */
  public Date orderDate;

  /**
   * 单据状态
   */
  public String state;

  /**
   * 单据号
   */
  public String no;

  /**
   * 供应商
   */
  public String erpSupplierId;

  /**
   * 采购合计
   */
  public Double total;

  /**
   * 备注
   */
  public String remark;

  /**
   * 采购申请人
   */
  public String sysUserId;

  public Date getOrderDate() {
    return this.orderDate;
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
  public String getNo() {
    return this.no;
  }

  @Column(
      length = 32
  )
  public String getErpSupplierId() {
    return this.erpSupplierId;
  }

  public Double getTotal() {
    return this.total;
  }

  @Column(
      length = 500
  )
  public String getRemark() {
    return this.remark;
  }

  @Column(
      length = 32
  )
  public String getSysUserId() {
    return this.sysUserId;
  }
}
