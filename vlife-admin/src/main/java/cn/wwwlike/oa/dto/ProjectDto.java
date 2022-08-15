package cn.wwwlike.oa.dto;

import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * 项目编辑
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
public class ProjectDto implements SaveBean<Project> {
    public String id;
    public String name;
    public String accountId;
}
