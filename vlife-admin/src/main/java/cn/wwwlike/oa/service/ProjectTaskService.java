package cn.wwwlike.oa.service;

import cn.wwwlike.oa.dao.ProjectTaskDao;
import cn.wwwlike.oa.entity.ProjectTask;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class ProjectTaskService extends VLifeService<ProjectTask, ProjectTaskDao> {
}
