package cn.wwwlike.auth.api;

import cn.wwwlike.auth.dto.MenuResourcesDto;
import cn.wwwlike.auth.entity.SysGroupResources;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.req.SysMenuPageReq;
import cn.wwwlike.auth.service.SysGroupResourcesService;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import cn.wwwlike.vlife.query.req.PageQuery;
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
 * 菜单接口
 */
@RestController
@RequestMapping("/sysMenu")
public class SysMenuApi extends VLifeApi<SysMenu, SysMenuService> {
  @Autowired
  public SysResourcesService resourcesService;

  @Autowired
  public FormService formService;


  @Autowired
  public SysGroupResourcesService sysGroupResourcesService;
  /**
   * 菜单保存
   */
  @PostMapping("/save")
  public MenuVo save(@RequestBody SysMenu dto) {
    if(dto.getFormId()!=null&&dto.getPlaceholderUrl()==null&&dto.getUrl()!=null&&dto.getUrl().indexOf("*")!=-1){
      Form form=formService.findOne(dto.getFormId());
      dto.setPlaceholderUrl(form.getType());
    }
    if(StringUtils.isNotEmpty(dto.getUrl())){
      dto.setPageLayoutId(null);
    }
    service.save(dto);
    return service.queryOne(MenuVo.class,dto.getId());
  }
  /**
   * 菜单详情
   */
  @GetMapping("/detail/{id}")
  public SysMenu detail(@PathVariable String id) {
    return service.findOne(id);
  }
  /**
   * 菜单列表
   */
  @PostMapping("/list/all")
  public List<MenuVo> listAll(@RequestBody PageQuery req) {
    return service.query(MenuVo.class,req);
  }
  /**
   * 菜单查询
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
    Arrays.stream(ids).forEach(id->{
      service.relationRemove(id);
    });
    return service.remove(ids);
  }
  /**
   * 角色可用菜单和接口查询
   * 查询结果为封装的MenuVo的对象
   */
  @GetMapping("/list/roleResources")
  public List<MenuVo> roleResources(String sysRoleId,String appId) {
    if(StringUtils.isEmpty(appId)){
      return new ArrayList<>();
    }
    return service.getMenuVos(sysRoleId,appId);
  }
  /**
   * 关联资源详情
   */
  @GetMapping("/detail/menuResourcesDto/{id}")
  public MenuResourcesDto detailMenuResourcesDto(@PathVariable String id){
    MenuResourcesDto dto= service.queryOne(MenuResourcesDto.class,id);
    if(dto.getSysResources_id()!=null){
      List<SysResources> resources=resourcesService.findByIds(dto.getSysResources_id().toArray(new String[0]));
//      dto.setRequireIds(resources.stream().filter(r->r.isMenuRequired()).map(SysResources::getId).collect(Collectors.toList())); ;
    }
    return dto;
  }

  /**
   * 导入资源
   */
  @PostMapping("/save/menuResourcesDto")
  public MenuResourcesDto saveMenuResourcesDto(@RequestBody MenuResourcesDto dto){
    dto=service.importResources(dto);
    sysGroupResourcesService.clearNoimportResources();
    return dto;
  }

}
