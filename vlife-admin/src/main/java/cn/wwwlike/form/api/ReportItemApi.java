package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.ReportItem;
import cn.wwwlike.form.req.ReportItemPageReq;
import cn.wwwlike.form.service.ReportItemService;
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
     * 保存报表统计项;
     *
     * @param dto 报表统计项;
     * @return 报表统计项;
     */
    @PostMapping("/save")
    public ReportItem save(@RequestBody ReportItem dto) {
        return service.save(dto);
    }

    /**
     * 明细查询报表统计项;
     *
     * @param id 主键id;
     * @return 报表统计项;
     */
    @GetMapping("/detail/{id}")
    public ReportItem detail(@PathVariable String id) {
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

    /**
     * 统计项分页查询
     */
    @GetMapping("/page")
    public PageVo<ReportItem> page(ReportItemPageReq req) {
        return service.findPage(req);
    }

    @GetMapping("/list/all")
    public List<ReportItem> listAll(ReportItemPageReq req) {
        return service.find(req);
    }

    @GetMapping("/test")
    public String test(String aa) {
        return aa + "test";
    }
}
