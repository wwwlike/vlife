package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.req.SysMenuPageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.List;

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
   *
   * @param dto 菜单;
   * @return 菜单;
   */
  @PostMapping("/save")
  public SysMenu save(@RequestBody SysMenu dto) {
    return service.save(dto);
  }

  /**
   * 明细查询菜单;
   *
   * @param id ;
   * @return 菜单;
   */
  @GetMapping("/detail/{id}")
  public SysMenu detail(@PathVariable String id) {
    return service.findOne(id);
  }


  /**
   * 所有菜单
   *
   * @return 菜单;
   */
  @GetMapping("/list/all")
  public List<SysMenu> listAll() {
    return service.findAll();
  }


  /**
   * 菜单查询
   *
   * @param req
   * @return
   */
  @GetMapping("/page")
  public PageVo<SysMenu> page(SysMenuPageReq req) {
    return service.findPage(req);
  }

  /**
   * 逻辑删除;
   * @param id ;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove/{id}")
  public Long remove(@PathVariable String id) {
    return service.remove(id);
  }

  /**
   * 查找一个角色的资源（角色已绑定的+未被角色绑定的）
   *
   * @param sysRoleId
   * @return
   */
  @GetMapping("/list/roleResources")
  public List<MenuVo> roleResources(String sysRoleId) {
    return service.getMenuVos(sysRoleId);
  }

}
