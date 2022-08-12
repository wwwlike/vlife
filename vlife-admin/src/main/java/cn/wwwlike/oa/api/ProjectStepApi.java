package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.ProjectStep;
import cn.wwwlike.oa.service.ProjectStepService;
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
