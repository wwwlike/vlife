package cn.wwwlike.auth.api;

import cn.wwwlike.auth.dto.RoleDto;
import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.auth.req.SysRolePageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色接口;
 */
@RestController
@RequestMapping("/sysRole")
public class SysRoleApi extends VLifeApi<SysRole, SysRoleService> {
  @Autowired
  public SysResourcesService resourcesService;
  @Autowired
  public SysMenuService menuService;
  /**
   * 角色保存
   */
  @PostMapping("/save/roleDto")
  public RoleDto saveRoleDto(@RequestBody RoleDto dto) {
    if(dto.getResourcesAndMenuIds()!=null){
      dto.setSysMenu_id(
      menuService.findByIds(dto.getResourcesAndMenuIds().toArray(new String[dto.getResourcesAndMenuIds().size()])).stream().map(DbEntity::getId).collect(Collectors.toList())
      );
      dto.setSysResources_id(
              resourcesService.findByIds(dto.getResourcesAndMenuIds().toArray(new String[dto.getResourcesAndMenuIds().size()])).stream().map(DbEntity::getId).collect(Collectors.toList())
      );
    }
    return service.save(dto,true);
  }
  /**
   * 角色详情
   */
  @GetMapping("/detail/{id}")
  public SysRole detail(@PathVariable String id) {
    return service.findOne(id);
  }
  /**
   * 角色查询
   */
  @PostMapping("/page")
  public PageVo<SysRole> page(@RequestBody SysRolePageReq req) {
    return service.findPage(req);
  }
  /**
   * 角色列表
   * @return
   */
  @GetMapping("/list/all")
  public List<SysRole> listAll() {
    return service.findAll();
  }
  /**
   * 角色删除
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
