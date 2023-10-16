package cn.wwwlike.demo.service;

import cn.wwwlike.demo.dao.DemoProjectDao;
import cn.wwwlike.demo.entity.DemoProject;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class DemoProjectService extends VLifeService<DemoProject, DemoProjectDao> {
}
