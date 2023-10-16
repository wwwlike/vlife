package cn.wwwlike.auth.api;

import cn.wwwlike.auth.dto.RoleDto;
import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.auth.req.SysRolePageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户角色接口;
 */
@RestController
@RequestMapping("/sysRole")
public class SysRoleApi extends VLifeApi<SysRole, SysRoleService> {
  @Autowired
  public SysResourcesService resourcesService;

  @Autowired
  public SysMenuService menuService;
  /**
   * 保存用户角色;
   * @param dto 用户角色;
   * @return 用户角色;
   */
  @PostMapping("/save")
  public SysRole save(@RequestBody SysRole dto) {
    return service.save(dto);
  }

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
   * 明细查询用户角色;
   */
  @GetMapping("/detail/{id}")
  public SysRole detail(@PathVariable String id) {
    return service.findOne(id);
  }

  @GetMapping("/page")
  public PageVo<SysRole> page(SysRolePageReq req) {
    return service.findPage(req);
  }

  @GetMapping("/list/all")
  public List<SysRole> listAll() {
    return service.findAll();
  }

  /**
   * 角色逻辑删除
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
