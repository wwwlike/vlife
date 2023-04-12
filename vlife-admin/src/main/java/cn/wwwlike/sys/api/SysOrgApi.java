package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysOrg;
import cn.wwwlike.sys.req.SysOrgPageReq;
import cn.wwwlike.sys.service.SysOrgService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 机构接口;
 */
@RestController
@RequestMapping("/sysOrg")
public class SysOrgApi extends VLifeApi<SysOrg, SysOrgService> {
  /**
   * 分页查询;
   * @param req 机构查询条件;
   * @return null;
   */
  @GetMapping("/page")
  public PageVo<SysOrg> page(SysOrgPageReq req) {
    return service.findPage(req);
  }

  /**
   * 机构保存;
   * @param dto 机构信息;
   * @return ;
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

  /**
   * 所有机构查询(机构树时使用)
   * @return
   */
  @GetMapping("/list/all")
  public List<SysOrg> listAll(String entityName) {
    QueryWrapper<SysOrg> wrapper = QueryWrapper.of(SysOrg.class);
    if(entityName!=null&&!entityName.equals("sysOrg")){
      wrapper.filterRuleClz=GlobalData.entityDto(entityName).getClz();
    }
    return service.find(wrapper);
  }

}
