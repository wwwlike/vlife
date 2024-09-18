package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.CustomFilterInvocationSecurityMetadataSource;
import cn.wwwlike.auth.config.CustomGroupSimpleFilterInvocationSecurityMetadataSource;
import cn.wwwlike.auth.dto.GroupDto;
import cn.wwwlike.auth.dto.GroupResourcesDto;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.req.SysGroupPageReq;
import cn.wwwlike.auth.service.SysGroupResourcesService;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

/**
 * 权限组接口
 */
@RestController
@RequestMapping("/sysGroup")
public class SysGroupApi extends VLifeApi<SysGroup, SysGroupService> {
  @Autowired
  public SysGroupResourcesService groupResourcesService;

  //权限组列表
  @PostMapping("/list/all")
  public List<SysGroup> listAll(@RequestBody PageQuery req) {
    return service.find(req);
  }
  //权限组查询
  @PostMapping("/page")
  public PageVo<SysGroup> page(SysGroupPageReq req) {
    if(groupResourcesService.findAll().size()==0){
      groupResourcesService.tran();
    }
    return service.findPage(req);
  }


  /**
   * 权限组保存
   */
  @PostMapping("/save/groupDto")
  public GroupDto saveGroupDto(@RequestBody GroupDto dto) {
    service.save(dto,true);
    BaseService.groups=new HashMap<>();//刷新权限组
    CustomFilterInvocationSecurityMetadataSource.urlRole=null;
    return dto;
  }


  /**
   * 权限组(资源)保存
   */
  @PostMapping("/save/groupResourcesDto")
  public GroupResourcesDto saveGroupResourcesDto(@RequestBody GroupResourcesDto dto) {
    service.save(dto,true);
    groupResourcesService.clearNoimportResources();//把取消的资源与权限的绑定删除
    BaseService.groups=new HashMap<>();//刷新权限组
    CustomGroupSimpleFilterInvocationSecurityMetadataSource.urlGroup=null;
    return dto;
  }


  //权限组详情
  @GetMapping("/detail/{id}")
  public SysGroup detail(@PathVariable String id) {
    return service.findOne(id);
  }
  /**
   * 权限组删除
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
