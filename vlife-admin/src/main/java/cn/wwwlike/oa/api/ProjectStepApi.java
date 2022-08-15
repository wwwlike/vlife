package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.ProjectStep;
import cn.wwwlike.oa.service.ProjectStepService;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 项目阶段关系表接口;
 */
@RestController
@RequestMapping("/projectStep")
public class ProjectStepApi extends VLifeApi<ProjectStep, ProjectStepService> {
  /**
   * 保存项目阶段关系表;
   * @param dto 项目阶段关系表;
   * @return 项目阶段关系表;
   */
  @PostMapping("/save")
  public ProjectStep save(@RequestBody ProjectStep dto) {
    return service.save(dto);
  }

  /**
   * 明细查询项目阶段关系表;
   * @param id 主键id;
   * @return 项目阶段关系表;
   */
  @GetMapping("/detail/{id}")
  public ProjectStep detail(@PathVariable String id) {
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
