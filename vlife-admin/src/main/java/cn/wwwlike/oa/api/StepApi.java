package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.Step;
import cn.wwwlike.oa.service.StepService;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 项目阶段接口;
 */
@RestController
@RequestMapping("/step")
public class StepApi extends VLifeApi<Step, StepService> {
  /**
   * 保存项目阶段;
   * @param dto 项目阶段;
   * @return 项目阶段;
   */
  @PostMapping("/save")
  public Step save(@RequestBody Step dto) {
    return service.save(dto);
  }

  /**
   * 明细查询项目阶段;
   * @param id 主键id;
   * @return 项目阶段;
   */
  @GetMapping("/detail/{id}")
  public Step detail(@PathVariable String id) {
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
