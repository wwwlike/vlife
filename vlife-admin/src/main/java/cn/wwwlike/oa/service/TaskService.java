package cn.wwwlike.oa.service;

import cn.wwwlike.oa.dao.TaskDao;
import cn.wwwlike.oa.entity.Task;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class TaskService extends VLifeService<Task, TaskDao> {
}
