package cn.wwwlike.demo.dto;

import cn.wwwlike.demo.entity.DemoProject;
import cn.wwwlike.demo.entity.DemoTask;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 项目dto
 */
@Data
public class ProjectDto implements SaveBean<DemoProject> {
    public String id;
    public String name;
    public String sysUserId;
    public Integer point;
    public String status;
    public Double total;
    public Date beginDate;
    public Date endDate;
    public String demoCustomerId;
    //任务详情
    public List<DemoTask> taskList;
}
