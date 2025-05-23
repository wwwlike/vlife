// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.dto;

import cn.vlife.erp.entity.ErpOrderSaleSend;
import cn.vlife.erp.entity.ErpOrderSaleSendItem;
import cn.wwwlike.vlife.base.SaveBean;
import java.lang.Double;
import java.lang.String;
import java.util.Date;
import java.util.List;
import lombok.Data;

/**
 * 发货单
 */
@Data
public class ErpOrderSaleSendDto extends SaveBean<ErpOrderSaleSend> {
  /**
   * 发货单号
   */
  public String no;

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
   * 发货单明细
   */
  public List<ErpOrderSaleSendItem> erpOrderSaleSendItem;
}
