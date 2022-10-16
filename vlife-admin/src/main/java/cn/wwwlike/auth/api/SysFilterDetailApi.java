package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.auth.req.SysFilterDetailPageReq;
import cn.wwwlike.auth.service.SysFilterDetailService;
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
 * 可过滤的项目接口;
 */
@RestController
@RequestMapping("/sysFilterDetail")
public class SysFilterDetailApi extends VLifeApi<SysFilterDetail, SysFilterDetailService> {
  /**
   * 保存可过滤的项目;
   * @param dto 可过滤的项目;
   * @return 可过滤的项目;
   */
  @PostMapping("/save")
  public SysFilterDetail saveSysFilter(@RequestBody SysFilterDetail dto) {
    return service.save(dto);
  }

  /**
   * 明细查询可过滤的项目;
   * @param id 主键id;
   * @return 可过滤的项目;
   */
  @GetMapping("/detail/{id}")
  public SysFilterDetail detail(@PathVariable String id) {
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
  public PageVo<SysFilterDetail> page(SysFilterDetailPageReq req){
      return service.findPage(req);
  }



}
