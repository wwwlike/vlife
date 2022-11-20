package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.FormCondition;
import cn.wwwlike.form.req.FormConditionPageReq;
import cn.wwwlike.form.service.FormConditionService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 查询过滤条件接口;
 */
@RestController
@RequestMapping("/formCondition")
public class FormConditionApi extends VLifeApi<FormCondition, FormConditionService> {
    /**
     * 保存查询过滤条件;
     *
     * @param dto 查询过滤条件;
     * @return 查询过滤条件;
     */
    @PostMapping("/save")
    public FormCondition save(@RequestBody FormCondition dto) {
        return service.save(dto);
    }

    /**
     * 明细查询查询过滤条件;
     *
     * @param id 主键id;
     * @return 查询过滤条件;
     */
    @GetMapping("/detail/{id}")
    public FormCondition detail(@PathVariable String id) {
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
     * 过滤条件分页查询
     */
    @GetMapping("/page")
    public PageVo<FormCondition> page(FormConditionPageReq req) {
        return service.findPage(req);
    }

}
