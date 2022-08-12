package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysOrg;
import cn.wwwlike.sys.req.SysOrgPageReq;
import cn.wwwlike.sys.service.SysOrgService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * null接口;
 */
@RestController
@RequestMapping("/sysOrg")
public class SysOrgApi extends VLifeApi<SysOrg, SysOrgService> {
  /**
   * 分页查询null;
   * @param req 机构查询条件;
   * @return null;
   */
  @GetMapping("/page")
  public PageVo<SysOrg> page(SysOrgPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存null;
   * @param dto null;
   * @return null;
   */
  @PostMapping("/save")
  public SysOrg save(@RequestBody SysOrg dto) {
    return service.save(dto);
  }

  /**
   * 明细查询null;
   * @param id 主键id;
   * @return null;
   */
  @GetMapping("/detail/{id}")
  public SysOrg detail(@PathVariable String id) {
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
