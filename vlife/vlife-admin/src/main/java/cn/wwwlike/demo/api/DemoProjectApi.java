package cn.wwwlike.demo.api;

import cn.wwwlike.demo.dto.ProjectDto;
import cn.wwwlike.demo.entity.DemoProject;
import cn.wwwlike.demo.req.DemoProjectPageReq;
import cn.wwwlike.demo.service.DemoProjectService;
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
 * 项目表接口;
 */
@RestController
@RequestMapping("/demoProject")
public class DemoProjectApi extends VLifeApi<DemoProject, DemoProjectService> {
  /**
   * 分页查询项目表;
   * @param req 项目查询;
   * @return 项目表;
   */
  @GetMapping("/page")
  public PageVo<DemoProject> page(DemoProjectPageReq req) {
    return service.findPage(req);
  }


  /**
   * 保存项目
   */
  @PostMapping("/save")
  public DemoProject save(@RequestBody DemoProject demoProject) {
    return service.save(demoProject);
  }

  /**
   * 保存项目dto;
   * @param projectDto 项目dto;
   * @return 项目dto;
   */
  @PostMapping("/save/projectDto")
  public ProjectDto saveProjectDto(@RequestBody ProjectDto projectDto) {
    return service.save(projectDto);
  }

  /**
   * 明细查询项目表;
   * @param id 主键id;
   * @return 项目表;
   */
  @GetMapping("/detail/{id}")
  public DemoProject detail(@PathVariable String id) {
    return service.findOne(id);
  }


  @GetMapping("/detail/projectDto/{id}")
  public ProjectDto detailProjectDto(@PathVariable String id) {
    return service.queryOne(ProjectDto.class,id);
  }

  /**
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
