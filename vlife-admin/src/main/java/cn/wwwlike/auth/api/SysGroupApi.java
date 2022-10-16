package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dto.GroupDto;
import cn.wwwlike.auth.dto.GroupFilterDto;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.req.SysGroupPageReq;
import cn.wwwlike.auth.service.SysFilterDetailService;
import cn.wwwlike.auth.service.SysFilterService;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.auth.vo.SysFilterVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 角色聚合组接口;
 */
@RestController
@RequestMapping("/sysGroup")
public class SysGroupApi extends VLifeApi<SysGroup, SysGroupService> {
  @Autowired
  public SysResourcesService resourcesService;
  @Autowired
  public SysFilterService sysFilterService;

  @Autowired
  public SysFilterDetailService filterDetailService;
  @GetMapping("/page")
  public PageVo<SysGroup> page(SysGroupPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存角色聚合组;
   * @param dto 角色聚合组;
   * @return 角色聚合组;
   */
  @PostMapping("/save/groupDto")
  public GroupDto saveGroupDto(@RequestBody GroupDto dto) {
    filterDetailService.filterClear();
    service.save(dto,true);
    GroupFilterDto filterDto=service.queryOne(GroupFilterDto.class,dto.getId());
    filterDto=sysFilterService.ruleSettings(filterDto,dto.getScope());
    saveGroupFilterDto(filterDto);
    return dto;
  }

  /**
   * 明细查询角色聚合组;
   * @param id 主键id;
   * @return 角色聚合组;
   */
  @GetMapping("/detail/{id}")
  public SysGroup detail(@PathVariable String id) {
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

  /**
   * 查询权限组可操作的查询条件
   * @param id 权限组id
   */
  @GetMapping("/list/sysFilterVo")
  public List<SysFilterVo> listSysFilterVo( String id){
    if(StringUtils.isNotBlank(id)&&!"null".equals(id)){
      List<SysFilterVo> vo= sysFilterService.support(id,true);
      //过滤掉非业务模块
      if(SecurityConfig.getCurrUser().getUsername().equals("manage")){
        return vo;
      }else{
        return vo.stream().filter(v->v.getBusniess()).collect(Collectors.toList());
      }
    }
    return null;
  }

  /**
   * 查询权限保存
   */
  @PostMapping("/save/groupFilterDto")
  public GroupFilterDto saveGroupFilterDto(@RequestBody GroupFilterDto dto) {
    filterDetailService.filterClear();
    return service.save(dto,true);
  }
}
