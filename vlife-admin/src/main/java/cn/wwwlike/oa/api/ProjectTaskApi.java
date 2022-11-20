package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.ProjectTask;
import cn.wwwlike.oa.service.ProjectTaskService;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 项目任务表接口;
 */
@RestController
@RequestMapping("/projectTask")
public class ProjectTaskApi extends VLifeApi<ProjectTask, ProjectTaskService> {
  /**
   * 保存项目任务表;
   * @param dto 项目任务表;
   * @return 项目任务表;
   */
  @PostMapping("/save")
  public ProjectTask save(@RequestBody ProjectTask dto) {
    return service.save(dto);
  }

  /**
   * 明细查询项目任务表;
   * @param id 主键id;
   * @return 项目任务表;
   */
  @GetMapping("/detail/{id}")
  public ProjectTask detail(@PathVariable String id) {
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
