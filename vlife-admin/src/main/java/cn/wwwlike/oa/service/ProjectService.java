package cn.wwwlike.oa.service;

import cn.wwwlike.common.BaseService;
import cn.wwwlike.oa.dao.ProjectDao;
import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.oa.item.ProjectItem;
import cn.wwwlike.vlife.bi.GroupWrapper;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService extends BaseService<Project, ProjectDao> {

    public List<ProjectItem> count(GroupWrapper<Project> req){
        return dao.report(ProjectItem.class,req);
    }

}
