package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 任务表
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Entity
@Table(name = "oa_task")
public class Task extends DbEntity {
    /**
     * 所属项目
     */
    public String projectId;
    /**
     * 任务点数
     */
    public Integer point;
    /**
     * 当前完成进度
     */
    public Double progress;
    /**
     * 任务完成状态
     */
    public String state;
    /**
     * 任务名称
     */
    public String name;
    /**
     * 排序
     */
    public Integer sort;
    /**
     * 紧急程度(字典)
     */
    public String level;
    /**
     * 当前所在阶段
     */
    public String stepId;
    /**
     * 任务创建人
     */
    public String accountId;

}
