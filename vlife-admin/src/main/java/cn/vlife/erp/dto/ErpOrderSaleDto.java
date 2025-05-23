// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.dto;

import cn.vlife.erp.entity.ErpOrderSale;
import cn.vlife.erp.entity.ErpOrderSaleItem;
import cn.wwwlike.vlife.base.SaveBean;
import java.lang.Double;
import java.lang.String;
import java.util.Date;
import java.util.List;
import lombok.Data;

/**
 * 销售订单
 */
@Data
public class ErpOrderSaleDto extends SaveBean<ErpOrderSale> {
  /**
   * 单据号
   */
  public String no;

  /**
   * 客户
   */
  public String erpCustomerId;

  /**
   * 销售日期
   */
  public Date orderDate;

  /**
   * 销售负责人
   */
  public String sysUserId;

  /**
   * 订单总金额
   */
  public Double totalPrice;

  /**
   * 订单状态
   */
  public String state;

  /**
   * 销售明细
   */
  public List<ErpOrderSaleItem> erpOrderSaleItem;

  /**
   * 备注
   */
  public String remark;
}
