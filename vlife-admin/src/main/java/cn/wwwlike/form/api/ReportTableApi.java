package cn.wwwlike.form.api;

import cn.wwwlike.form.dto.ReportTableSaveDto;
import cn.wwwlike.form.entity.ReportTable;
import cn.wwwlike.form.service.ReportTableService;
import cn.wwwlike.form.vo.ReportTableVo;
import cn.wwwlike.vlife.bi.ReportQuery;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 报表接口;
 */
@RestController
@RequestMapping("/reportTable")
public class ReportTableApi extends VLifeApi<ReportTable, ReportTableService> {
    /**
     * 保存报表;
     *
     * @param dto 报表;
     * @return 报表;
     */
    @PostMapping("/save/reportTableSaveDto")
    public ReportTableSaveDto save(@RequestBody ReportTableSaveDto dto) {
        return service.save(dto);
    }

    /**
     * 明细查询报表配置视图;
     *
     * @param id 主键id;
     * @return 报表配置视图;
     */
    @GetMapping("/detail/{id}")
    public ReportTableVo detail(@PathVariable String id) {
        return service.queryOne(ReportTableVo.class, id);
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
    public List<ReportTableSaveDto> listAll() {
        return service.queryAll(ReportTableSaveDto.class);
    }

    /**
     * 报表查询
     *
     * @param req
     * @return
     */
    @GetMapping("/report")
    public List report(ReportQuery req) {
        return service.report(req);
    }
}
