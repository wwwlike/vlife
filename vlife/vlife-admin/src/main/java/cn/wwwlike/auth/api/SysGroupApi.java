package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.CustomFilterInvocationSecurityMetadataSource;
import cn.wwwlike.auth.dto.GroupDto;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.req.SysGroupPageReq;
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
  public SysResourcesService resourcesService;
  //权限组列表
  @PostMapping("/list/all")
  public List<SysGroup> listAll(@RequestBody PageQuery req) {
    return service.find(req);
  }
  //权限组查询
  @PostMapping("/page")
  public PageVo<SysGroup> page(SysGroupPageReq req) {
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
