package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.PageComponentProp;
import cn.wwwlike.form.service.PageComponentPropService;
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
 * 组件属性接口;
 */
@RestController
@RequestMapping("/pageComponentProp")
public class PageComponentPropApi extends VLifeApi<PageComponentProp, PageComponentPropService> {
  /**
   * 保存组件属性;
   * @param dto 组件属性;
   * @return 组件属性;
   */
  @PostMapping("/save/componentProp")
  public PageComponentProp saveComponentProp(@RequestBody PageComponentProp dto) {
    return service.save(dto);
  }

  /**
   * 明细查询组件属性;
   * @param id 主键id;
   * @return 组件属性;
   */
  @GetMapping("/detail/{id}")
  public PageComponentProp detail(@PathVariable String id) {
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
