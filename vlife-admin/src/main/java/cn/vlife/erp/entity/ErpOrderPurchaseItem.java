// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.Double;
import java.lang.Integer;
import java.lang.String;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 采购明细
 */
@Entity
@Setter
@Table
public class ErpOrderPurchaseItem extends DbEntity {
  /**
   * 采购单
   */
  public String erpOrderPurchaseId;

  /**
   * 产品
   */
  public String erpProductId;

  /**
   * 单价
   */
  public Double price;

  /**
   * 数量
   */
  public Integer total;

  /**
   * 到货数量
   */
  public Integer received;

  /**
   * 退货数量
   */
  public Integer reback;

  /**
   * 仓库
   */
  public String erpWarehouseId;

  @Column(
      length = 32
  )
  public String getErpOrderPurchaseId() {
    return this.erpOrderPurchaseId;
  }

  @Column(
      length = 32
  )
  public String getErpProductId() {
    return this.erpProductId;
  }

  public Double getPrice() {
    return this.price;
  }

  public Integer getTotal() {
    return this.total;
  }

  public Integer getReceived() {
    return this.received;
  }

  public Integer getReback() {
    return this.reback;
  }

  @Column(
      length = 32
  )
  public String getErpWarehouseId() {
    return this.erpWarehouseId;
  }
}
