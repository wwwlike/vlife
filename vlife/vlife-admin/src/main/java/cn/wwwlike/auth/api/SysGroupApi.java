package cn.wwwlike.auth.api;

import cn.wwwlike.auth.dto.GroupDto;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.req.SysGroupPageReq;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

/**
 * 角色聚合组接口;
 */
@RestController
@RequestMapping("/sysGroup")
public class SysGroupApi extends VLifeApi<SysGroup, SysGroupService> {
  @Autowired
  public SysResourcesService resourcesService;

  @GetMapping("/list/all")
  public List<SysGroup> listAll() {
    return service.findAll();
  }

  @GetMapping("/page")
  public PageVo<SysGroup> page(SysGroupPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存角色聚合组;
   * @param dto 角色聚合组;
   * @return 角色聚合组;
   */
  @PostMapping("/save/groupDto")
  public GroupDto saveGroupDto(@RequestBody GroupDto dto) {
    service.save(dto,true);
    BaseService.groups=new HashMap<>();//刷新权限组
    return dto;
  }

  /**
   * 明细查询角色聚合组;
   * @param id 主键id;
   * @return 角色聚合组;
   */
  @GetMapping("/detail/{id}")
  public SysGroup detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除;
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }

}
