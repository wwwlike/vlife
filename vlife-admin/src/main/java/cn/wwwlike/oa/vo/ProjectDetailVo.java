package cn.wwwlike.oa.vo;

import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.oa.entity.Step;
import cn.wwwlike.oa.entity.Task;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
public class ProjectDetailVo implements VoBean<Project> {
    public String id;
    /**
     * 项目名称
     */
    public String name;

    /**
     * 项目负责人姓名
     */
    public String account_name;
    /**
     * 计划开始日期
     */
    public Date planDate;
    /**
     * 结束日期
     */
    public Date finishedDate;
    /**
     * 项目状态 project_state
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

    /**
     * 项目的生命周期
     */
    @VField(pathName = "projectStep_step")
    public List<Step> steps;

    /**
     * 项目下的任务
     */
    public List<Task> tasks;

}
