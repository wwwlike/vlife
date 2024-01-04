package cn.wwwlike.auth.api;

import cn.wwwlike.auth.dto.MenuResourcesDto;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.req.SysMenuPageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
  @Autowired
  public SysResourcesService resourcesService;
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
  @PostMapping("/page")
  public PageVo<SysMenu> page(@RequestBody SysMenuPageReq req) {
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
  /**
   * 菜单关联资源详情
   * 有保存接口，则一定有查看明细接口
   * @return
   */
  @GetMapping("/detail/menuResourcesDto/{id}")
  public MenuResourcesDto detailMenuResourcesDto(@PathVariable String id){
    MenuResourcesDto dto= service.queryOne(MenuResourcesDto.class,id);
    if(dto.getSysResources_id()!=null){
      List<SysResources> resources=resourcesService.findByIds(dto.getSysResources_id().toArray(new String[0]));
      dto.setRequireIds(resources.stream().filter(r->r.isMenuRequired()).map(SysResources::getId).collect(Collectors.toList())); ;
    }
    return dto;
  }
  /**
   * 菜单资源关联保存
   */
  @PostMapping("/save/menuResourcesDto")
  public MenuResourcesDto saveMenuResourcesDto(@RequestBody MenuResourcesDto dto){
    SysMenu menu=service.findOne(dto.getId());
    MenuResourcesDto _dto=service.save(dto,true);
    //菜单如果关联了权限资源则解除与角色关联
    if(dto.getSysResources_id()!=null&&menu.getSysRoleId()!=null){
      menu.setSysRoleId(null);
      service.save(menu);
    }
    resourcesService.clearRoleWithMenuEmpty();
    String[] requireIds = dto.getRequireIds() != null ? dto.getRequireIds().toArray(new String[0]) : new String[0];
    resourcesService.resourcesRequired(true,requireIds);
    resourcesService.resourcesRequired(false,
      resourcesService.menuUseableResources(menu.getFormId(),
              dto.getId()).stream().map(DbEntity::getId).filter(t->dto.getRequireIds()==null?true:!dto.getRequireIds().contains(t)).collect(Collectors.toList()).toArray(new String[0]));
    return _dto;
  }

}
