package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.ProjectAccount;
import cn.wwwlike.oa.service.ProjectAccountService;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 项目人员关系表(分配关系)接口;
 */
@RestController
@RequestMapping("/projectAccount")
public class ProjectAccountApi extends VLifeApi<ProjectAccount, ProjectAccountService> {
  /**
   * 保存项目人员关系表(分配关系);
   * @param dto 项目人员关系表(分配关系);
   * @return 项目人员关系表(分配关系);
   */
  @PostMapping("/save")
  public ProjectAccount save(@RequestBody ProjectAccount dto) {
    return service.save(dto);
  }

  /**
   * 明细查询项目人员关系表(分配关系);
   * @param id 主键id;
   * @return 项目人员关系表(分配关系);
   */
  @GetMapping("/detail/{id}")
  public ProjectAccount detail(@PathVariable String id) {
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
