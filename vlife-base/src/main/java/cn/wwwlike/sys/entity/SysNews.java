// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import java.lang.Boolean;
import java.lang.Integer;
import java.lang.String;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Setter;

/**
 * 通知公告
 */
@Entity
@Setter
@Table
@VClazz(
    orders = "top_desc"
)
public class SysNews extends DbEntity {
  /**
   * 查看次数
   */
  public Integer total;

  /**
   * 内容
   */
  public String content;

  /**
   * 标题
   */
  public String title;

  /**
   * 是否发布
   */
  public Boolean state;

  /**
   * 置顶
   */
  public Boolean top;

  /**
   * 政策文件
   */
  public String pdf;

  /**
   * 发现
   */
  public String sysGroupIds;

  public Integer getTotal() {
    return this.total;
  }

  @Column(
      columnDefinition = "text"
  )
  public String getContent() {
    return this.content;
  }

  @Column(
      length = 64
  )
  public String getTitle() {
    return this.title;
  }

  public Boolean getState() {
    return this.state;
  }

  public Boolean getTop() {
    return this.top;
  }

  @Column(
      length = 32
  )
  public String getPdf() {
    return this.pdf;
  }

  @Column(
      length = 255
  )
  public String getSysGroupIds() {
    return this.sysGroupIds;
  }
}
