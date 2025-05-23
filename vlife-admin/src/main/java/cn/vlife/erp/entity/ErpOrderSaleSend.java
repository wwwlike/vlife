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
 * 销售发货单
 */
@Entity
@Setter
@Table
public class ErpOrderSaleSend extends DbEntity {
  /**
   * 销售单
   */
  public String erpOrderSaleId;

  /**
   * 发货人
   */
  public String sysUserId;

  /**
   * 发货日期
   */
  public Date sendDate;
  /**
   * 备注
   */
  public String remark;
  /**
   * 发货总金额
   */
  public Double totalPrice;
  /**
   * 发货单号
   */
  public String no;

  @Column(
      length = 32
  )
  public String getErpOrderSaleId() {
    return this.erpOrderSaleId;
  }

  @Column(
      length = 32
  )
  public String getSysUserId() {
    return this.sysUserId;
  }

  public Date getSendDate() {
    return this.sendDate;
  }

  @Column(
      length = 500
  )
  public String getRemark() {
    return this.remark;
  }

  public Double getTotalPrice() {
    return this.totalPrice;
  }

  @Column(
      length = 32
  )
  public String getNo() {
    return this.no;
  }
}
