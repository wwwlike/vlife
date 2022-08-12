package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.Task;
import cn.wwwlike.oa.req.TaskListReq;
import cn.wwwlike.oa.service.TaskService;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 任务表接口;
 */
@RestController
@RequestMapping("/task")
public class TaskApi extends VLifeApi<Task, TaskService> {
  /**
   * 列表查询任务表;
   * @param req 任务过滤;
   * @return 任务表;
   */
  @GetMapping("/list")
  public List<Task> list(TaskListReq req) {
    return service.find(req);
  }

  /**
   * 保存任务表;
   * @param dto 任务表;
   * @return 任务表;
   */
  @PostMapping("/save")
  public Task save(@RequestBody Task dto) {
    return service.save(dto);
  }

  /**
   * 明细查询任务表;
   * @param id 主键id;
   * @return 任务表;
   */
  @GetMapping("/detail/{id}")
  public Task detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove/{id}")
  public Long remove(@PathVariable String id) {
    return service.remove(id);
  }
}
