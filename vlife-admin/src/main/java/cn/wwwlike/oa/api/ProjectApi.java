package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.oa.req.ProjectPageReq;
import cn.wwwlike.oa.service.ProjectService;
import cn.wwwlike.vlife.bean.PageVo;
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
 * 项目管理接口;
 */
@RestController
@RequestMapping("/project")
public class ProjectApi extends VLifeApi<Project, ProjectService> {
  /**
   * 分页查询项目管理;
   * @param req 类说明;
   * @return 项目管理;
   */
  @GetMapping("/page")
  public PageVo<Project> page(ProjectPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存项目管理;
   * @param dto 项目管理;
   * @return 项目管理;
   */
  @PostMapping("/save")
  public Project save(@RequestBody Project dto) {
    return service.save(dto);
  }

  /**
   * 明细查询项目管理;
   * @param id 主键id;
   * @return 项目管理;
   */
  @GetMapping("/detail/{id}")
  public Project detail(@PathVariable String id) {
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
