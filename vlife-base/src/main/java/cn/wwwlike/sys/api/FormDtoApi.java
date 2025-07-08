package cn.wwwlike.sys.api;

import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.entity.FormField;
import cn.wwwlike.sys.entity.SysApp;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.req.FormPageReq;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysAppService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/formDto")
public class FormDtoApi extends VLifeApi<FormDto, FormService> {
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysAppService appService;

    /**
     * 所有模型
     * model=true
     */
    @PostMapping("/list/model")
    public List<FormDto> listModel(@RequestBody FormPageReq req){
        return  service.query(FormDto.class,req);
    }
    /**
     * 查询所有子表模型
     * 排除没有接口的子表(多对多关联的可以不做展示)
     */
    @PostMapping("/list/subModels/{entityType}")
    public List<FormDto> listSubModels(@PathVariable String entityType){
        QueryWrapper<Form> qw=QueryWrapper.of(Form.class);
        qw.eq("itemType","entity").ne("type",entityType).andSub(FormField.class, qw1->qw1.eq("fieldName",entityType+"Id"));
        List<FormDto> forms= service.query(FormDto.class,qw);
        //有接口的关联子表(排除多对多)
        return forms.stream().filter(f->resourcesService.count(QueryWrapper.of(SysResources.class).eq("formId",f.getId()))>0).collect(Collectors.toList());
    }

    /**
     * 模型创建
     */
    @PostMapping("/save")
    public FormDto save(@RequestBody FormDto dto) {
        dto=service.syncDictCode(dto); //字典修改后更新field
        String id = service.save(dto, true).getId();
        return dto;
    }

    /**
     * 模型发布
     * 提交
     */
    @PostMapping("/publish")
    public FormDto publish(@RequestBody FormDto dto){
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getTypeClass()==null||!dto.getTypeClass().startsWith("cn.wwwlike"),"平台模型不能操作");
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getSysAppId()!=null,"当前模型没有与应用关联");
        SysApp app=appService.findOne(dto.getSysAppId());
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(app!=null,"应用需要设置一个appKey生成路径的包名");
        return service.publish(dto);
    }



    /**
     * 实体模型修订和发布
     */
    @PostMapping("/entityPublish")
    public FormDto entityPublish(@RequestBody FormDto dto){
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getTypeClass()==null||!dto.getTypeClass().startsWith("cn.wwwlike"),"平台模型不能操作");
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getSysAppId()!=null,"当前模型没有与应用关联");
        SysApp app=appService.findOne(dto.getSysAppId());
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(app!=null,"应用需要设置一个appKey生成路径的包名");
        return service.entityPublish(dto);
    }

}
