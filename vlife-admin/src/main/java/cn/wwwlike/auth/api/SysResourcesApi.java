package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.req.SysResourcesPageReq;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 权限资源接口;
 * 1. 实现从前端菜单json读取菜单信息
 * 2. 实现从api里能自动读取所有操作接口信息
 * 3. 在页面能对这些信息进行CRUD操作
 */
@RestController
@RequestMapping("/sysResources")
public class SysResourcesApi extends VLifeApi<SysResources, SysResourcesService> {
  /**
   * 保存权限资源;
   * @param dto 权限资源;
   * @return 权限资源;
   */
  @PostMapping("/save")
  public SysResources save(@RequestBody SysResources dto) {
    return service.save(dto);
  }

  /**
   * 明细查询权限资源;
   * @param id 主键id;
   * @return 权限资源;
   */
  @GetMapping("/detail/{id}")
  public SysResources detail(@PathVariable String id) {
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

  @GetMapping("/page")
  public PageVo<SysResources> page(SysResourcesPageReq req){
    return service.findPage(req);
  }

}
