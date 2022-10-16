package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysFilter;
import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.auth.req.SysFilterPageReq;
import cn.wwwlike.auth.service.SysFilterService;
import cn.wwwlike.auth.vo.SysFilterVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 可过滤的实体主表接口;
 */
@RestController
@RequestMapping("/sysFilter")
public class SysFilterApi extends VLifeApi<SysFilter, SysFilterService> {

  /**
   * 保存可过滤的实体主表;
   * @param dto 可过滤的实体主表;
   * @return 可过滤的实体主表;
   */
  @PostMapping("/save")
  public SysFilter save(@RequestBody SysFilter dto) {
    return service.save(dto);
  }

  /**
   * 明细查询可过滤的实体主表;
   * @param id 主键id;
   * @return 可过滤的实体主表;
   */
  @GetMapping("/detail/{id}")
  public SysFilter detail(@PathVariable String id) {
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

  @GetMapping("/initData")
  public void initData(){
    service.initData();
  }

  @GetMapping("/page")
  public PageVo<SysFilter> page(SysFilterPageReq req){
      return service.findPage(req);
  }
}
