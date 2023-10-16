package cn.wwwlike.demo.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 项目表
 */
@Data
@Table(name = "demo_project")
@Entity
public class DemoProject extends DbEntity {
    //项目名称
    public String name;
    //项目负责人
    public String sysUserId;
    //项目点数
    public Integer point;
    //项目状态
    @VField(dictCode = "project_status")
    public String status;
    //项目金额
    public Double total;
    //开始日期
    public Date beginDate;
    //结束日期
    public Date endDate;
    //甲方客户
    public String demoCustomerId;
}
