package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysRoleGroup;
import cn.wwwlike.auth.service.SysRoleGroupService;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 角色聚合组接口;
 */
@RestController
@RequestMapping("/sysRoleGroup")
public class SysRoleGroupApi extends VLifeApi<SysRoleGroup, SysRoleGroupService> {
  /**
   * 保存角色聚合组;
   */
  @PostMapping("/save")
  public SysRoleGroup save(@RequestBody SysRoleGroup dto) {
    return service.save(dto);
  }

  /**
   * 明细查询角色聚合组;
   */
  @GetMapping("/detail/{id}")
  public SysRoleGroup detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 角色权限组删除;
   */
  @DeleteMapping("/remove/{id}")
  public Long remove(@PathVariable String id) {
    return service.remove(id);
  }
}
