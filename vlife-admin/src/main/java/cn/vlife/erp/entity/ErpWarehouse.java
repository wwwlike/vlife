// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.String;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 仓库
 */
@Entity
@Setter
@Table
public class ErpWarehouse extends DbEntity {
  /**
   * 主要负责人
   */
  public String sysUserId;

  /**
   * 仓库名称
   */
  public String name;

  /**
   *  状态
   */
  public String state;

  /**
   * 仓库地址
   */
  public String address;

  @Column(
      length = 32
  )
  public String getSysUserId() {
    return this.sysUserId;
  }

  @Column(
      length = 32
  )
  public String getName() {
    return this.name;
  }

  @Column(
      length = 32
  )
  public String getState() {
    return this.state;
  }

  @Column(
      length = 64
  )
  public String getAddress() {
    return this.address;
  }
}
