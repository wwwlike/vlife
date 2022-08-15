package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.auth.req.SysRolePageReq;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 用户角色接口;
 */
@RestController
@RequestMapping("/sysRole")
public class SysRoleApi extends VLifeApi<SysRole, SysRoleService> {
  /**
   * 保存用户角色;
   * @param dto 用户角色;
   * @return 用户角色;
   */
  @PostMapping("/save")
  public SysRole save(@RequestBody SysRole dto) {
    return service.save(dto);
  }

  /**
   * 明细查询用户角色;
   * @param id 主键id;
   * @return 用户角色;
   */
  @GetMapping("/detail/{id}")
  public SysRole detail(@PathVariable String id) {
    return service.findOne(id);
  }


  @GetMapping("/page")
  public PageVo<SysRole> detail(SysRolePageReq req) {
    return service.findPage(req);
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
