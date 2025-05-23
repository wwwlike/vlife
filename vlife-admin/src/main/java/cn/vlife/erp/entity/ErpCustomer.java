// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.String;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 客户
 */
@Entity
@Setter
@Table
public class ErpCustomer extends DbEntity {
  /**
   * 公司全称
   */
  public String name;

  /**
   * 客户负责人
   */
  public String sysUserId;

  /**
   * 客户等级
   */
  public String level;

  /**
   * 地址
   */
  public String address;

  /**
   * 联系方式
   */
  public String tel;

  /**
   * 联系人
   */
  public String linkman;

  /**
   * 开户银行
   */
  public String bank;

  /**
   * 银行账号
   */
  public String bankNo;

  /**
   * 纳税人识别号
   */
  public String tinNo;

  @Column(
      length = 32
  )
  public String getName() {
    return this.name;
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
  public String getLevel() {
    return this.level;
  }

  @Column(
      length = 50
  )
  public String getAddress() {
    return this.address;
  }

  @Column(
      length = 32
  )
  public String getTel() {
    return this.tel;
  }

  @Column(
      length = 32
  )
  public String getLinkman() {
    return this.linkman;
  }

  @Column(
      length = 32
  )
  public String getBank() {
    return this.bank;
  }

  @Column(
      length = 32
  )
  public String getBankNo() {
    return this.bankNo;
  }

  @Column(
      length = 32
  )
  public String getTinNo() {
    return this.tinNo;
  }
}
