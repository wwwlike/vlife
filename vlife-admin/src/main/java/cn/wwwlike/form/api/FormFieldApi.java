package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.form.service.FormFieldService;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 列表字段接口;
 */
@RestController
@RequestMapping("/formField")
public class FormFieldApi extends VLifeApi<FormField, FormFieldService> {
    /**
     * 保存列表字段;
     *
     * @param dto 列表字段;
     * @return 列表字段;
     */
    @PostMapping("/save")
    public FormField save(@RequestBody FormField dto) {
        return service.save(dto);
    }

    /**
     * 明细查询列表字段;
     *
     * @param id null;
     * @return 列表字段;
     */
    @GetMapping("/detail/{id}")
    public FormField detail(@PathVariable String id) {
        return service.findOne(id);
    }

    /**
     * 逻辑删除;
     *
     * @param id null;
     * @return 已删除数量;
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }

    @GetMapping("/list/all")
    public List<FormField> listAll(String formId) {
        if (formId == null) {
            return new ArrayList<>();
        }
        return service.find(QueryWrapper.of(FormField.class).eq("formId", formId));
    }
}
