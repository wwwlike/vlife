package cn.wwwlike.oa.api;

import cn.wwwlike.oa.dto.ProjectDto;
import cn.wwwlike.oa.dto.ProjectPinDto;
import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.oa.req.ProjectPageReq;
import cn.wwwlike.oa.service.ProjectService;
import cn.wwwlike.oa.vo.ProjectDetailVo;
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
@RequestMapping("/project")
public class ProjectApi extends VLifeApi<Project, ProjectService> {
  /**
   * 分页查询项目表;
   * @param req 项目分页查询条件;
   * @return 项目表;
   */
  @GetMapping("/page")
  public PageVo<Project> page(ProjectPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存项目编辑;
   * @param dto 项目编辑;
   * @return 项目编辑;
   */
  @PostMapping("/save")
  public ProjectDto save(@RequestBody ProjectDto dto) {
    return service.save(dto);
  }

  /**
   * 保存收藏;
   * @param dto 收藏;
   * @return 收藏;
   */
  @PostMapping("/save/pin")
  public ProjectPinDto savePin(@RequestBody ProjectPinDto dto) {
    return service.save(dto);
  }

  /**
   * 明细查询类说明;
   * @param id 主键id;
   * @return 类说明;
   */
  @GetMapping("/detail/{id}")
  public ProjectDetailVo detail(@PathVariable String id) {
    return service.queryOne(ProjectDetailVo.class,id);
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
