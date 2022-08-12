package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 项目人员关系表(分配关系)
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Entity
@Table(name = "oa_project_account")
public class ProjectAccount extends DbEntity {
    public String projectId;
    public String accountId;
}
