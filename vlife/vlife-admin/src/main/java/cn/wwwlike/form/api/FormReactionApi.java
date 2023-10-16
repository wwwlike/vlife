package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.FormReaction;
import cn.wwwlike.form.service.FormReactionService;
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
 * 表单响应接口;
 */
@RestController
@RequestMapping("/formReaction")
public class FormReactionApi extends VLifeApi<FormReaction, FormReactionService> {
  /**
   * 保存表单响应;
   * @param dto 表单响应;
   * @return 表单响应;
   */
  @PostMapping("/save")
  public FormReaction save(@RequestBody FormReaction dto) {
    return service.save(dto);
  }

  /**
   * 明细查询表单响应;
   * @param id 主键id;
   * @return 表单响应;
   */
  @GetMapping("/detail/{id}")
  public FormReaction detail(@PathVariable String id) {
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
