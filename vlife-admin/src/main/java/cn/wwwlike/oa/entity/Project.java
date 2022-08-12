package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 项目表
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Table(name = "oa_project")
@Entity
public class Project extends DbEntity {
    /**
     * 项目名称
     */
    public String name;
    /**
     * 收藏
     * 暂时所有人公用
     */
    public Boolean pin;
    /**
     * 项目负责人
     */
    public String accountId;
    /**
     * 计划开始日期
     */
    public Date planDate;
    /**
     * 结束日期
     */
    public Date finishedDate;
    /**
     * 项目状态
     */
    public String state;
    /**
     * 项目类型
     */
    public String type;
    /**
     * 项目任务总点数
     */
    public Integer totalPoint;
    /**
     * 已经完成的任务点数
     */
    public Integer finishedPoint;

}
