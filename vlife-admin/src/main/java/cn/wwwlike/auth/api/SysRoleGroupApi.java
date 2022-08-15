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
   * @param dto 角色聚合组;
   * @return 角色聚合组;
   */
  @PostMapping("/save")
  public SysRoleGroup save(@RequestBody SysRoleGroup dto) {
    return service.save(dto);
  }

  /**
   * 明细查询角色聚合组;
   * @param id 主键id;
   * @return 角色聚合组;
   */
  @GetMapping("/detail/{id}")
  public SysRoleGroup detail(@PathVariable String id) {
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
