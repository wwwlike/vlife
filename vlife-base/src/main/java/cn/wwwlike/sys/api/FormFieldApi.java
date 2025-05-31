package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.FormField;
import cn.wwwlike.sys.service.FormFieldService;
import cn.wwwlike.sys.vo.FieldSelect;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 元数据字段接口
 * 数据保存在主表里完成
 */
@RestController
@RequestMapping("/formField")
public class FormFieldApi extends VLifeApi<FormField, FormFieldService> {
    /**
     * 字段数据
     */
    @PostMapping("/list/all")
    public <Q extends VlifeQuery> List<FormField> listAll(@RequestBody Q req) {
        return super.list(req);
    }

    /**
     * 列表批量设置
     */
    @PostMapping("/save/formFieldList")
    public List<FormField> saveFormFieldList(@RequestBody  List<FormField> fields){
        fields.forEach(f->{
            service.save(f);
        });
        return fields;
    }

    /**
     * 外键的主表字段查询
     */
    @GetMapping("/list/relationField")
    public List<FormField> listRelationField(String realationFieldId) {
      return service.findByFkFieldId(realationFieldId);
    }
    /**
     * 可分组字段查询
     * 查询当前表和其主表能分组的字段
     */
    @GetMapping("/list/groupOption")
    public List<FieldSelect> groupOption(String formId) {
        return service.queryGroupField(formId);
    }

}
