package cn.wwwlike.auth.api;

import cn.wwwlike.auth.dto.GroupDto;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.req.SysGroupPageReq;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 角色聚合组接口;
 */
@RestController
@RequestMapping("/sysGroup")
public class SysGroupApi extends VLifeApi<SysGroup, SysGroupService> {

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
  public GroupDto save(@RequestBody GroupDto dto) {
    return service.save(dto,true);
  }



  /**
   * 保存角色聚合组;
   * @param dto 角色聚合组;
   * @return 角色聚合组;
   */
  @PostMapping("/save")
  public SysGroup save(@RequestBody SysGroup dto) {
    return service.save(dto);
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
}
