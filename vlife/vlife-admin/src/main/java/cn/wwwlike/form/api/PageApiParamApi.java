package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.PageApiParam;
import cn.wwwlike.form.service.PageApiParamService;
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
 * API参数接口;
 */
@RestController
@RequestMapping("/pageApiParam")
public class PageApiParamApi extends VLifeApi<PageApiParam, PageApiParamService> {
  /**
   * 保存API参数;
   * @param dto API参数;
   * @return API参数;
   */
  @PostMapping("/save/apiParam")
  public PageApiParam saveApiParam(@RequestBody PageApiParam dto) {
    return service.save(dto);
  }

  /**
   * 明细查询API参数;
   * @param id 主键id;
   * @return API参数;
   */
  @GetMapping("/detail/{id}")
  public PageApiParam detail(@PathVariable String id) {
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
