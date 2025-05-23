// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.String;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 供应商
 */
@Entity
@Setter
@Table
public class ErpSupplier extends DbEntity {
  /**
   * 供应商名称
   */
  public String name;

  /**
   * 所属行业
   */
  public String hy;

  /**
   * 供应商描述
   */
  public String remark;

  /**
   * 联系电话
   */
  public String tel;

  /**
   * 联系人
   */
  public String linkman;

  @Column(
      length = 32
  )
  public String getName() {
    return this.name;
  }

  @Column(
      length = 32
  )
  public String getHy() {
    return this.hy;
  }

  @Column(
      length = 32
  )
  public String getRemark() {
    return this.remark;
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
}
