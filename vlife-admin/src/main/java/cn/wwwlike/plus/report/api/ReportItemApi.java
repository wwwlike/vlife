package cn.wwwlike.plus.report.api;

import cn.wwwlike.plus.report.entity.ReportItem;
import cn.wwwlike.plus.report.req.ReportItemPageReq;
import cn.wwwlike.plus.report.service.ReportItemService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 报表统计项接口;
 */
@RestController
@RequestMapping("/reportItem")
public class ReportItemApi extends VLifeApi<ReportItem, ReportItemService> {
  /**
   * 分页查询报表统计项;
   * @param req 统计项目查询条件;
   * @return 报表统计项;
   */
  @GetMapping("/page")
  public PageVo<ReportItem> page(ReportItemPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存报表统计项;
   * @param dto 报表统计项;
   * @return 报表统计项;
   */
  @PostMapping("/save")
  public ReportItem save(@RequestBody ReportItem dto) {
    return service.save(dto);
  }

  /**
   * 明细查询报表统计项;
   * @param id 主键id;
   * @return 报表统计项;
   */
  @GetMapping("/detail/{id}")
  public ReportItem detail(@PathVariable String id) {
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
   * 所有统计项
   * @param req
   * @return
   */
  @GetMapping("/list/all")
  public List<ReportItem> listAll(ReportItemPageReq req) {
    return service.find(req);
  }
}
