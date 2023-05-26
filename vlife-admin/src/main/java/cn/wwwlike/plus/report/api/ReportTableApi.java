package cn.wwwlike.plus.report.api;

import cn.wwwlike.plus.report.dto.ReportTableSaveDto;
import cn.wwwlike.plus.report.entity.ReportTable;
import cn.wwwlike.plus.report.req.ReportTablePageReq;
import cn.wwwlike.plus.report.service.ReportTableService;
import cn.wwwlike.plus.report.vo.ReportTableVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.bi.ReportQuery;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 报表配置(主)接口;
 */
@RestController
@RequestMapping("/reportTable")
public class ReportTableApi extends VLifeApi<ReportTable, ReportTableService> {


  /**
   * 明细查询报表配置(主);
   * @param id 主键id;
   * @return 报表配置(主);
   */
  @GetMapping("/detail/{id}")
  public ReportTableVo detail(@PathVariable String id) {
    return service.queryOne(ReportTableVo.class,id);
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
   * 报表保存
   */
  @PostMapping("/save/reportTableSaveDto")
  public ReportTableSaveDto saveReportTableSaveDto(@RequestBody ReportTableSaveDto dto) {
    return service.save(dto,true);
  }

  /**
   * 分页查询配置报表
   */
  @GetMapping("/page")
  public PageVo<ReportTable> page(ReportTablePageReq req) {
    return service.findPage(req);
  }

  /**
   * 所有配置报表
   */
  @GetMapping("/list/all")
  public List<ReportTableSaveDto> listAll() {
    return service.queryAll(ReportTableSaveDto.class);
  }


  /**
   * 报表查询
   * list里放的是一行记录，记录的形式是map; 每个统计项/指标项/分组项 的code是key，值就是统计出来的数值；
   * [
   {createid:123,avg:1,total:2},{createid:2222,avg:1,total:2}
   * ]
   * @param req
   * @return
   */
  @GetMapping("/report")
  public List<Map> report(ReportQuery req) {
    return service.report(req);
  }

  /**
   * 单个统计值指标code查询
   * @return
   */
  @GetMapping("/total/{code}")
  public Number total(@PathVariable String code) {
    return  (Number)service.queryOne(code);
  }
}
