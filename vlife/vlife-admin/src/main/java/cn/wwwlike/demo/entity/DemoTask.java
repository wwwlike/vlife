package cn.wwwlike.demo.entity;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 任务表
 */
@Data
@Table(name = "demo_task")
@Entity
public class DemoTask extends DbEntity {
    //任务点数
    public Integer point;
    //任务名称
    public String name;
    //任务说明
    public String remark;
    //任务负责人
    public String sysUserId;
    //任务类型
    @VField(dictCode = "task_type")
    public String type;
    //所属项目
    public String demoProjectId;
}
