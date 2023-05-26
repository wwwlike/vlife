package cn.wwwlike.plus.report.api;

import cn.wwwlike.plus.report.entity.ReportTableItem;
import cn.wwwlike.plus.report.service.ReportTableItemService;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 报表配置明细接口;
 */
@RestController
@RequestMapping("/reportTableItem")
public class ReportTableItemApi extends VLifeApi<ReportTableItem, ReportTableItemService> {
  /**
   * 保存报表配置明细;
   * @param dto 报表配置明细;
   * @return 报表配置明细;
   */
  @PostMapping("/save")
  public ReportTableItem save(@RequestBody ReportTableItem dto) {
    return service.save(dto);
  }

  /**
   * 明细查询报表配置明细;
   * @param id 主键id;
   * @return 报表配置明细;
   */
  @GetMapping("/detail/{id}")
  public ReportTableItem detail(@PathVariable String id) {
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
