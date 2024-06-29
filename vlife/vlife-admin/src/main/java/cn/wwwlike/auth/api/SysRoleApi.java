package cn.wwwlike.auth.api;
import cn.wwwlike.auth.config.CustomFilterInvocationSecurityMetadataSource;
import cn.wwwlike.auth.dto.RoleDto;
import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.auth.req.SysRolePageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.web.security.core.EAuthenticationFailureHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色接口
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
  public RoleDto saveRoleDto(@RequestBody RoleDto dto) throws Exception {
    if(dto.resourcesAndMenuIds!=null){
      dto.setSysMenu_id(
      menuService.findByIds(dto.resourcesAndMenuIds.toArray(new String[dto.getResourcesAndMenuIds().size()])).stream().map(DbEntity::getId).collect(Collectors.toList())
      );
      dto.setSysResources_id(
              resourcesService.findByIds(dto.resourcesAndMenuIds.toArray(new String[dto.getResourcesAndMenuIds().size()])).stream().map(DbEntity::getId).collect(Collectors.toList())
      );
    }else{
      dto.setSysResources_id(null);
      dto.setSysMenu_id(null);
    }
    service.save(dto,true);
    CustomFilterInvocationSecurityMetadataSource.urlRole=null;
    return dto;
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
   */
  @PostMapping("/list/all")
  public List<SysRole> listAll(@RequestBody PageQuery req) {
    return service.find(req);
  }
  /**
   * 角色删除
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
