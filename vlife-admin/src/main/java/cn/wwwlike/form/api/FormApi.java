package cn.wwwlike.form.api;

import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.form.vo.FormReportItemCompVo;
import cn.wwwlike.form.vo.FormReportKpiCompVo;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 列表字段接口;
 */
@RestController
@RequestMapping("/form")
public class FormApi extends VLifeApi<Form, FormService> {
    /**
     * 根据用途查询该类别已经保存的模型和能够支持该类型的模型
     *
     * @return
     */
    @GetMapping("/models/{uiType}")
    public List<FormVo> models(@PathVariable String uiType) {
        Collection<? extends BeanDto> entitys = GlobalData.getEntityDtos().values();
        List<BeanDto> dtos = new ArrayList<>();//查询的指定模型
        if (VCT.ITEM_TYPE.LIST.equals(uiType)) {//列表用途
            dtos = new ArrayList<>(GlobalData.getVoDtos().values());
        } else if (VCT.ITEM_TYPE.SAVE.equals(uiType)) {//数据编辑用途
            dtos = new ArrayList<>(GlobalData.getSaveDtos().values());
        } else if (VCT.ITEM_TYPE.VO.equals(uiType)) {// 数据展示用途
            dtos = new ArrayList<>(GlobalData.getSaveDtos().values());
        } else if (VCT.ITEM_TYPE.REQ.equals(uiType)) { //数据查询用途
            dtos = new ArrayList<>(GlobalData.getReqDtos().values());
        }
        if (!VCT.ITEM_TYPE.REQ.equals(uiType)) {
            dtos.addAll(new ArrayList<>(entitys));
        }
        return service.getFormsByUiType(uiType, dtos);
    }

    /**
     * 查询指定模型信息
     *
     * @param uiType
     * @param modelName
     * @return
     */
    @GetMapping("/model")
    public FormVo model(String uiType, String modelName) {
        VlifeQuery<Form> request = new VlifeQuery(Form.class);
        request.qw(Form.class).eq("uiType", uiType).eq("type", modelName);
        List<FormVo> published = service.query(FormVo.class, request);
        FormVo form = null;
        if (published != null && published.size() > 0) {
            form = published.get(0);
        } else {
            Collection<? extends BeanDto> list = GlobalData.getEntityDtos().values();
            Optional<? extends BeanDto> dto = list.stream().filter(beanDto ->
                    beanDto.getType().equalsIgnoreCase(modelName)).findAny();
            if (dto.isPresent() == false) {
                if (VCT.ITEM_TYPE.LIST.equals(uiType)) {//列表用途
                    list = new ArrayList<>(GlobalData.getVoDtos().values());
                } else if (VCT.ITEM_TYPE.SAVE.equals(uiType)) {//数据编辑用途
                    list = new ArrayList<>(GlobalData.getSaveDtos().values());
                } else if (VCT.ITEM_TYPE.VO.equals(uiType)) {// 数据展示用途
                    list = new ArrayList<>(GlobalData.getSaveDtos().values());
                } else if (VCT.ITEM_TYPE.REQ.equals(uiType)) { //数据查询用途
                    list = new ArrayList<>(GlobalData.getReqDtos().values());
                }
                dto = list.stream().filter(beanDto ->
                        beanDto.getType().equalsIgnoreCase(modelName)).findAny();
            }
            if (dto.isPresent()) {
                form = service.tran(dto.get(), uiType);
            }
        }
        /**
         * 对机构/地区/部门的查询组件与查询权限范围进行对比，最多选出一个符合的组件展示
         */
        if (uiType.equals("req")) {
            form = service.reqModelFilter(form);
        }
        return form;
    }

    /**
     * 实体模型
     *
     * @return
     */
    @RequestMapping("/entityModels")
    public List<FormVo> entityModels() {
        return service.queryAll(FormVo.class).stream().filter(v -> v.getItemType().equals("entity")).collect(Collectors.toList());
    }

    /**
     * 保存列表字段;
     *
     * @param dto 列表字段;
     * @return 列表字段;
     */
    @PostMapping("/save/formDto")
    public FormVo save(@RequestBody FormDto dto) {
        String id = service.save(dto, true).getId();
        FormVo vo = service.queryOne(FormVo.class, id);
        return vo;
    }

    /**
     * 保存列表字段;
     *
     * @param dto 列表字段;
     * @return 列表字段;
     */
    @PostMapping("/save")
    public Form save(@RequestBody Form dto) {
        return service.save(dto);
    }

    /**
     * 单个模型信息查询
     */
    @GetMapping("/detail/formVo/{id}")
    public FormVo detailFormVo(@PathVariable String id) {
        return service.queryOne(FormVo.class, id);
    }

    /**
     * 统计项选择组件vo对象
     */
    @GetMapping("/formReportItemAll")
    public List<FormReportItemCompVo> formReportItemAll() {
        QueryWrapper qw = QueryWrapper.of(Form.class);
        qw.eq("itemType", "entity");
        return service.query(FormReportItemCompVo.class, qw);
    }


    /**
     * 指标项选择组件vo都西昂
     */
    @GetMapping("/formReportKpiAll")
    public List<FormReportItemCompVo> formReportKpiAll() {
        QueryWrapper qw = QueryWrapper.of(Form.class);
        qw.eq("itemType", "entity");
        return service.query(FormReportKpiCompVo.class, qw);
    }

    /**
     * 找到指标，统计项所在表集合里拥有的共同的字段；
     * 需要找到关联表数据进行分组，如地区编码前6位进行分组
     * 能参与到分组的字段
     * 字段名称要一致；
     */
    @GetMapping("/groupField")
    public Map<String, String> groupField(String[] ids) {
        //方法稍后提供，线提供测试数据结果
        Map<String, String> map = new HashMap();
        //aaa
        return map;

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
}
