package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.ReportItem;
import cn.wwwlike.form.entity.ReportKpi;
import cn.wwwlike.form.req.ReportItemPageReq;
import cn.wwwlike.form.req.ReportKpiPageReq;
import cn.wwwlike.form.req.ReportKpiReq;
import cn.wwwlike.form.service.ReportKpiService;
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
     * 列表查询关键指标;
     *
     * @param req 指标查询条件;
     * @return 关键指标;
     */
    @GetMapping("/list")
    public List<ReportKpi> list(ReportKpiReq req) {
        return service.find(req);
    }

    /**
     * 保存关键指标;
     *
     * @param dto 关键指标;
     * @return 关键指标;
     */
    @PostMapping("/save")
    public ReportKpi save(@RequestBody ReportKpi dto) {
        return service.save(dto);
    }

    /**
     * 明细查询关键指标;
     *
     * @param id 主键id;
     * @return 关键指标;
     */
    @GetMapping("/detail/{id}")
    public ReportKpi detail(@PathVariable String id) {
        return service.findOne(id);
    }

    /**
     * 逻辑删除;
     *
     * @param id 主键id;
     * @return 已删除数量;
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }

    @GetMapping("/list/all")
    public List<ReportKpi> listAll() {
        return service.findAll();
    }


    /**
     * 指标项分页查询
     */
    @GetMapping("/page")
    public PageVo<ReportKpi> page(ReportKpiPageReq req) {
        return service.findPage(req);
    }

}
