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
 * 产品库存
 */
@Entity
@Setter
@Table
public class ErpProductTotal extends DbEntity {
  /**
   * 仓库
   */
  public String erpWarehouseId;

  /**
   * 产品
   */
  public String erpProductId;

  /**
   * 在库数量
   */
  public Integer totalNum;

  /**
   * 期末余额总计
   */
  public Double totalPrice;

  @Column(
      length = 32
  )
  public String getErpWarehouseId() {
    return this.erpWarehouseId;
  }

  @Column(
      length = 32
  )
  public String getErpProductId() {
    return this.erpProductId;
  }

  public Integer getTotalNum() {
    return this.totalNum;
  }

  public Double getTotalPrice() {
    return this.totalPrice;
  }
}
