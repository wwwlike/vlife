package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.ReportTableItem;
import cn.wwwlike.form.service.ReportTableItemService;
import cn.wwwlike.form.vo.ReportTableItemVo;
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
 * 报表明细接口;
 */
@RestController
@RequestMapping("/reportTableItem")
public class ReportTableItemApi extends VLifeApi<ReportTableItem, ReportTableItemService> {
  /**
   * 保存报表明细;
   * @param dto 报表明细;
   * @return 报表明细;
   */
  @PostMapping("/save")
  public ReportTableItem save(@RequestBody ReportTableItem dto) {
    return service.save(dto);
  }

  /**
   * 明细查询报表明细项视图;
   * @param id 主键id;
   * @return 报表明细项视图;
   */
  @GetMapping("/detail/{id}")
  public ReportTableItemVo detail(@PathVariable String id) {
    return service.queryOne(ReportTableItemVo.class,id);
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
