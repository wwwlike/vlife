// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.Integer;
import java.lang.String;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 发货单明细
 */
@Entity
@Setter
@Table
public class ErpOrderSaleSendItem extends DbEntity {
  /**
   * 销售发货单
   */
  public String erpOrderSaleSendId;
  /**
   * 订单产品
   * 销售明细id
   */
  public String erpOrderSaleItemId;
  /**
   * 库存仓库
   */
  public String erpProductTotalId;
  /**
   * 发货数量
   */
  public Integer totalSend;

  @Column(
      length = 32
  )
  public String getErpOrderSaleSendId() {
    return this.erpOrderSaleSendId;
  }

  @Column(
      length = 32
  )
  public String getErpOrderSaleItemId() {
    return this.erpOrderSaleItemId;
  }

  @Column(
      length = 32
  )
  public String getErpProductTotalId() {
    return this.erpProductTotalId;
  }

  public Integer getTotalSend() {
    return this.totalSend;
  }
}
