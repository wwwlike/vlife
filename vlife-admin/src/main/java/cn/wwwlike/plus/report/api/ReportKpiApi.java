package cn.wwwlike.plus.report.api;

import cn.wwwlike.plus.report.entity.ReportKpi;
import cn.wwwlike.plus.report.req.ReportKpiPageReq;
import cn.wwwlike.plus.report.service.ReportKpiService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 关键指标接口;
 */
@RestController
@RequestMapping("/reportKpi")
public class ReportKpiApi extends VLifeApi<ReportKpi, ReportKpiService> {
  /**
   * 分页查询关键指标;
   * @param req kpi指标项查询条件;
   * @return 关键指标;
   */
  @GetMapping("/page")
  public PageVo<ReportKpi> page(ReportKpiPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存关键指标;
   * @param dto 关键指标;
   * @return 关键指标;
   */
  @PostMapping("/save")
  public ReportKpi save(@RequestBody ReportKpi dto) {
    return service.save(dto);
  }

  /**
   * 明细查询关键指标;
   * @param id 主键id;
   * @return 关键指标;
   */
  @GetMapping("/detail/{id}")
  public ReportKpi detail(@PathVariable String id) {
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


  /**
   * 所有指标
   * @return
   */
  @GetMapping("/list/all")
  public List<ReportKpi> listAll() {
    return service.findAll();
  }

}
