// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.Double;
import java.lang.String;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 产品
 */
@Entity
@Setter
@Table
public class ErpProduct extends DbEntity {
  /**
   * 产品名
   */
  public String name;

  /**
   * 规格型号
   */
  public String specification;

  /**
   * 编码
   */
  public String code;

  /**
   * 计量单位
   */
  public String unit;

  /**
   * 标准售价
   */
  public Double price;

  /**
   * 产品分类
   */
  public String category;

  /**
   * 品牌
   */
  public String brand;

  @Column(
      length = 32
  )
  public String getName() {
    return this.name;
  }

  @Column(
      length = 32
  )
  public String getSpecification() {
    return this.specification;
  }

  @Column(
      length = 32
  )
  public String getCode() {
    return this.code;
  }

  @Column(
      length = 32
  )
  public String getUnit() {
    return this.unit;
  }

  public Double getPrice() {
    return this.price;
  }

  @Column(
      length = 32
  )
  public String getCategory() {
    return this.category;
  }

  @Column(
      length = 32
  )
  public String getBrand() {
    return this.brand;
  }
}
