package cn.wwwlike.form.api;

import cn.wwwlike.form.dto.PageConfDto;
import cn.wwwlike.form.entity.PageLayout;
import cn.wwwlike.form.service.PageLayoutService;
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
 * 页面布局接口;
 */
@RestController
@RequestMapping("/pageLayout")
public class PageLayoutApi extends VLifeApi<PageLayout, PageLayoutService> {

  /**
   * 页面布局保存
   */
  @PostMapping("/save/pageConfDto")
  public PageConfDto savePageConfDto(@RequestBody PageConfDto dto) {
    return service.save(dto,true);
  }

  /**
   * 明细查询页面布局;
   * @param id 主键id;
   * @return 页面布局;
   */
  @GetMapping("/detail/{id}")
  public PageConfDto detail(@PathVariable String id) {
    return service.queryOne(PageConfDto.class,id);
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
