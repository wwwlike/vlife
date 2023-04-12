package cn.wwwlike.oa.api;

import cn.wwwlike.oa.dto.ProjectDto;
import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.oa.item.ProjectItem;
import cn.wwwlike.oa.req.ProjectPageReq;
import cn.wwwlike.oa.service.ProjectService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.bi.GroupWrapper;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 项目管理接口;
 */
@RestController
@RequestMapping("/project")
public class ProjectApi extends VLifeApi<Project, ProjectService> {
    /**
     * 分页查询项目管理;
     *
     * @param req 项目管理查询条件;
     * @return 项目管理;
     */
    @GetMapping("/page")
    public PageVo<Project> page(ProjectPageReq req) {
        return service.findPage(req);
    }

    @GetMapping("/page/projectDto")
    public PageVo<ProjectDto> projectDto(ProjectPageReq req) {
        return service.queryPage(ProjectDto.class,req);
    }


    /**
     * 保存项目管理;
     *
     * @param dto 项目管理;
     * @return 项目管理;
     */
    @PostMapping("/save")
    public Project save(@RequestBody Project dto) {
        return service.save(dto);
    }


    /**
     * 保存项目管理;
     *
     * @param dto 项目管理;
     * @return 项目管理;
     */
    @PostMapping("/save/projectDto")
    public ProjectDto save(@RequestBody ProjectDto dto) {
        return service.save(dto, true);
    }


    /**
     * 明细查询项目管理;
     *
     * @param id 主键id;
     * @return 项目管理;
     */
    @GetMapping("/detail/{id}")
    public Project detail(@PathVariable String id) {
        return service.findOne(id);
    }

    /**
     * 逻辑删除;
     *
     * @param id 主键id;
     * @return 已删除数量;
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }

    @GetMapping("/count")
    public List<ProjectItem> count() {
        return service.count(new GroupWrapper<>(Project.class));
    }


}
