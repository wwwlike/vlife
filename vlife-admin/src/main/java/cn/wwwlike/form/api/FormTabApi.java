package cn.wwwlike.form.api;

import cn.wwwlike.form.dto.FormTabDto;
import cn.wwwlike.form.entity.FormTab;
import cn.wwwlike.form.service.FormTabService;
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
 * 表单页签接口;
 */
@RestController
@RequestMapping("/formTab")
public class FormTabApi extends VLifeApi<FormTab, FormTabService> {
  /**
   * 保存页签dto;
   * @param dto 页签dto;
   * @return 页签dto;
   */
  @PostMapping("/save")
  public FormTabDto save(@RequestBody FormTabDto dto) {
    return service.save(dto);
  }

  /**
   * 明细查询表单页签;
   * @param id ;
   * @return 表单页签;
   */
  @GetMapping("/detail/{id}")
  public FormTab detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除;
   * @param id ;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove/{id}")
  public Long remove(@PathVariable String id) {
    return service.remove(id);
  }
}
