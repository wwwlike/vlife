package cn.wwwlike.oa.service;

import cn.wwwlike.oa.dao.ProjectDao;
import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class ProjectService extends VLifeService<Project, ProjectDao> {
}
