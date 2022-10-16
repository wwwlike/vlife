package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysFilterGroup;
import cn.wwwlike.auth.service.SysFilterGroupService;
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
 * 权限组和查询权限绑定关系接口;
 */
@RestController
@RequestMapping("/sysFilterGroup")
public class SysFilterGroupApi extends VLifeApi<SysFilterGroup, SysFilterGroupService> {
  /**
   * 保存权限组和查询权限绑定关系;
   * @param dto 权限组和查询权限绑定关系;
   * @return 权限组和查询权限绑定关系;
   */
  @PostMapping("/save")
  public SysFilterGroup save(@RequestBody SysFilterGroup dto) {
    return service.save(dto);
  }

  /**
   * 明细查询权限组和查询权限绑定关系;
   * @param id 主键id;
   * @return 权限组和查询权限绑定关系;
   */
  @GetMapping("/detail/{id}")
  public SysFilterGroup detail(@PathVariable String id) {
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
