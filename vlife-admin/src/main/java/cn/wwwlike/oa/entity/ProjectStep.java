package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 项目阶段关系表
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Entity
@Table(name = "oa_project_step")
public class ProjectStep extends DbEntity {
    /**
     * 项目
     */
    public String projectId;
    /**
     * 项目的阶段
     */
    public String stepId;
}
