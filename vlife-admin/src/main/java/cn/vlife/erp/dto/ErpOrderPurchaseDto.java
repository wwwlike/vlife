// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.dto;

import cn.vlife.erp.entity.ErpOrderPurchase;
import cn.vlife.erp.entity.ErpOrderPurchaseItem;
import cn.wwwlike.vlife.base.SaveBean;
import java.lang.Double;
import java.lang.String;
import java.util.Date;
import java.util.List;
import lombok.Data;

/**
 * 采购订单
 */
@Data
public class ErpOrderPurchaseDto extends SaveBean<ErpOrderPurchase> {
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

  /**
   * 采购明细
   */
  public List<ErpOrderPurchaseItem> erpOrderPurchaseItem;

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
   * 订单日期
   */
  public Date orderDate;
}
