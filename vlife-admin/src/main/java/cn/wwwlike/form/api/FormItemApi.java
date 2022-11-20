package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.FormItem;
import cn.wwwlike.form.req.FormItemPageReq;
import cn.wwwlike.form.service.FormItemService;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.objship.read.GlobalData;
import com.google.common.reflect.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.wwwlike.vlife.objship.read.ItemReadTemplate.GSON;

/**
 * 单个查询统计项目接口;
 */
@RestController
@RequestMapping("/formItem")
public class FormItemApi extends VLifeApi<FormItem, FormItemService> {
    /**
     * 分页查询单个查询统计项目;
     *
     * @param req 工作项查询条件;
     * @return 单个查询统计项目;
     */
    @GetMapping("/page")
    public PageVo<FormItem> page(FormItemPageReq req) {
        return service.findPage(req);
    }

    /**
     * 保存单个查询统计项目;
     *
     * @param dto 单个查询统计项目;
     * @return 单个查询统计项目;
     */
    @PostMapping("/save")
    public FormItem save(@RequestBody FormItem dto) {
        return service.save(dto);
    }

    /**
     * 明细查询单个查询统计项目;
     *
     * @param id 主键id;
     * @return 单个查询统计项目;
     */
    @GetMapping("/detail/{id}")
    public FormItem detail(@PathVariable String id) {
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

    @Autowired
    FormService formService;

    @GetMapping("/json/{id}")
    public List json(@PathVariable String id) {
        FormItem item = service.findOne(id);
        Conditions condition = GSON.fromJson(item.getConditionJson(), new TypeToken<Conditions>() {
        }.getType());

        String entityName = formService.findOne(item.getEntityName()).getEntityType();
        return service.query(GlobalData.entityDto(entityName).getClz(), condition);
    }


    @GetMapping("/query")
    public List<FormItem> query(FormItemPageReq req) {
        return service.find(req);
    }
}
