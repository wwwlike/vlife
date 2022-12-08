package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.PageComponent;
import cn.wwwlike.form.service.PageComponentService;
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
 * 单元组件信息接口;
 */
@RestController
@RequestMapping("/pageComponent")
public class PageComponentApi extends VLifeApi<PageComponent, PageComponentService> {
  /**
   * 保存单元组件信息;
   * @param dto 单元组件信息;
   * @return 单元组件信息;
   */
  @PostMapping("/save/component")
  public PageComponent saveComponent(@RequestBody PageComponent dto) {
    return service.save(dto);
  }

  /**
   * 明细查询单元组件信息;
   * @param id 主键id;
   * @return 单元组件信息;
   */
  @GetMapping("/detail/{id}")
  public PageComponent detail(@PathVariable String id) {
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
