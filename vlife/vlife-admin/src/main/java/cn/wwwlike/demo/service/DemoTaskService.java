package cn.wwwlike.demo.service;

import cn.wwwlike.demo.dao.DemoTaskDao;
import cn.wwwlike.demo.entity.DemoTask;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class DemoTaskService extends VLifeService<DemoTask, DemoTaskDao> {
}
