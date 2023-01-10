package cn.wwwlike.form.api;

import cn.wwwlike.form.dto.ReportTableSaveDto;
import cn.wwwlike.form.entity.ReportTable;
import cn.wwwlike.form.service.ReportTableService;
import cn.wwwlike.form.vo.ReportTableVo;
import cn.wwwlike.vlife.bi.ReportQuery;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        return service.save(dto,true);
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

//    /**
//     * 单维度echart统计图封装
//     * 如：根据report的汇总项进行分组后查询：
//     */
//    @GetMapping("/chart")
//    public List<Map> simpleChart(ReportQuery req){
//        return service.itemReport(code,group);
//    }

}
