package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.FormGroup;
import cn.wwwlike.form.service.FormGroupService;
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
 * 表单容器接口;
 */
@RestController
@RequestMapping("/formGroup")
public class FormGroupApi extends VLifeApi<FormGroup, FormGroupService> {
  /**
   * 保存表单容器;
   * @param dto 表单容器;
   * @return 表单容器;
   */
  @PostMapping("/save")
  public FormGroup save(@RequestBody FormGroup dto) {
    return service.save(dto);
  }

  /**
   * 明细查询表单容器;
   * @param id 主键id;
   * @return 表单容器;
   */
  @GetMapping("/detail/{id}")
  public FormGroup detail(@PathVariable String id) {
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
