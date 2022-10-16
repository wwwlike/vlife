package cn.wwwlike.form.api;

import cn.wwwlike.form.dto.FormEventDto;
import cn.wwwlike.form.entity.FormEvent;
import cn.wwwlike.form.req.FormEventPageReq;
import cn.wwwlike.form.service.FormEventService;
import cn.wwwlike.form.vo.FormEventVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.List;

import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 触发事件接口;
 */
@RestController
@RequestMapping("/formEvent")
public class FormEventApi extends VLifeApi<FormEvent, FormEventService> {
  /**
   * 保存字段事件响应表单;
   * @param dto 字段事件响应表单;
   * @return 字段事件响应表单;
   */
  @PostMapping("/save/formEventDto")
  public FormEventDto saveFormEventDto(@RequestBody FormEventDto dto) {
    return service.save(dto,true);
  }

  /**
   * 明细查询触发事件;
   * @param id 主键id;
   * @return 触发事件;
   */
  @GetMapping("/detail/{id}")
  public FormEvent detail(@PathVariable String id) {
    return service.findOne(id);
  }

  @GetMapping("/page")
  public PageVo<FormEvent> page(FormEventPageReq req){
    return service.findPage(req);
  }

  @GetMapping("/list/formEventVo/{formId}")
  public List<FormEventVo> listFormEventVo(@PathVariable String formId){
    QueryWrapper wrapper=QueryWrapper.of(FormEvent.class);
    wrapper.eq("formId",formId);
    return service.query(FormEventVo.class, wrapper);
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
