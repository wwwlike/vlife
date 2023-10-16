package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.req.SysMenuPageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 菜单接口;
 */
@RestController
@RequestMapping("/sysMenu")
public class SysMenuApi extends VLifeApi<SysMenu, SysMenuService> {
  /**
   * 保存菜单;
   */
  @PostMapping("/save")
  public SysMenu save(@RequestBody SysMenu dto) {
    return service.save(dto);
  }

  /**
   * 菜单明细
   */
  @GetMapping("/detail/{id}")
  public SysMenu detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 所有菜单
   */
  @GetMapping("/list/all")
  public List<MenuVo> listAll() {
    return service.queryAll(MenuVo.class);
  }

  /**
   * 菜单分页查询
   */
  @GetMapping("/page")
  public PageVo<SysMenu> page(SysMenuPageReq req) {
    return service.findPage(req);
  }

  /**
   * 菜单删除
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
  /**
   * 查找一个角色的资源（角色已绑定的+未被角色绑定的）
   */
  @GetMapping("/list/roleResources")
  public List<MenuVo> roleResources(String sysRoleId,String appId) {
    if(StringUtils.isEmpty(appId)){
      return new ArrayList<>();
    }
    return service.getMenuVos(sysRoleId,appId);
  }

}
