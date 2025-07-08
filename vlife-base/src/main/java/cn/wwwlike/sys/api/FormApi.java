package cn.wwwlike.sys.api;
import cn.wwwlike.sys.entity.FormField;
import cn.wwwlike.sys.entity.SysApp;
import cn.wwwlike.sys.service.*;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.req.FormPageReq;
import cn.wwwlike.sys.vo.EntityVo;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 模型接口
 */
@RestController
@RequestMapping("/form")
public class FormApi extends VLifeApi<Form, FormService> {
    @Autowired
    private RestTemplateBuilder builder;
    @Autowired
    public SysMenuService menuService;
    @Autowired
    public SysAppService appService;
    @Bean
    public RestTemplate restTemplate() {
        return builder.build();
    }
    @Value("${vlife.generatorPackRoot}")
    public String generatorPackRoot;
    @Autowired
    public FormFieldService formfieldService;

    /**
     * 实体基础信息
     */
    @PostMapping("/list/entityVo")
    public List<EntityVo> entityVo(@RequestBody VlifeQuery<Form> req){
        QueryWrapper<Form> qw= req.qw(Form.class);
        qw.eq("itemType","entity");
        List<EntityVo> entityVos=service.query(EntityVo.class,req);
        List<FormField> fields=formfieldService.allEntityfkFields();
        Map<String, String> map = entityVos.stream()
                .collect(Collectors.toMap(EntityVo::getId, EntityVo::getType));
        qw=QueryWrapper.of(Form.class);
        qw.eq("itemType","dto");
        List<Form> dtos=service.find(qw);
        for (EntityVo vo:entityVos){
            vo.setParents(service.parents(fields,vo.getId()));
            vo.setSubs(service.subs(map,fields,vo.getType()));
            vo.setDtos(dtos.stream().filter(dto->dto.getEntityId().equals(vo.getId())).map(Form::getType).collect(Collectors.toList()));
        }
        return entityVos;
    }

    /**
     * 所有模型
     * model=true
     */
    @VMethod(permission = PermissionEnum.noAuth)
    @PostMapping("/list/model")
    public List<FormDto> listModel(@RequestBody FormPageReq req){
       return  service.query(FormDto.class,req);
    }

    /**
     * 查询子表
     * 排除没有接口的子表(多对多关联的可以不做展示)
     */
    @PostMapping("/list/subModels/{entityType}")
    public List<FormDto> listSubModels(@PathVariable String entityType){
       return service.querySubForms(entityType);
    }


    /**
     * 模型设计
     * 和工作流有关的进行工作流发布
     */
    @PostMapping("/save/formDto")
    public FormDto saveFormDto(@RequestBody FormDto dto) {
        dto=service.syncDictCode(dto); //字典修改后更新field
        String id = service.save(dto, true).getId();
        return dto;
    }



    /**
     * 实体模型修订和发布
     */
    @PostMapping("/entityPublish")
    public FormDto entityPublish(@RequestBody FormDto dto){
//        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(!VlifePathUtils.isRunningFromJar(),"当前生产环境，不支持模型设计");
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getTypeClass()==null||!dto.getTypeClass().startsWith("cn.wwwlike"),"平台模型不能操作");
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getSysAppId()!=null,"当前模型没有与应用关联");
        SysApp app=appService.findOne(dto.getSysAppId());
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(app!=null,"应用需要设置一个appKey生成路径的包名");
        return service.entityPublish(dto);
    }


    /**
     * 生成文件包路径地址
     */
    @VMethod(permission= PermissionEnum.noAuth)
    @GetMapping("/generatorPackRoot")
    public String generatorPackRoot(){
        return generatorPackRoot;
    }

    /**
     * 模型创建
     * 暂存
     */
    @PostMapping("/save")
    public Form save(@RequestBody Form form) {
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(form.getSysAppId()!=null,"当前模型没有与菜单应用关联");
        if(form.getState()==null){
            form.setState(VCT.MODEL_STATE.CREATING); //保存状态
        }
        if((form.getId()==null&&form.getTypeClass()==null) ||  ((VCT.MODEL_TYPE.ENTITY.equals(form.getItemType())&& !form.getType().equals(form.getEntityType()))) ){
            if(VCT.MODEL_TYPE.ENTITY.equals(form.getItemType())){
                form.setEntityType(form.getType());
                form.setTypeClass(menuService.typeClass(form.getSysAppId(),form.getItemType(),form.getType()));
            }else{
                FormDto entitydto=service.getModelByType(form.getEntityType());
                String entityTypeClass=entitydto.getTypeClass();
                if(entityTypeClass!=null){
                    String rootPackage=entityTypeClass.substring(0,entityTypeClass.indexOf(".entity."));
                    form.setTypeClass(rootPackage+"."+form.getItemType()+"."+ StringUtils.capitalize(form.getType()));
                }
            }
        }
        if(form.getItemType().equals("entity")){
            form.setTypeParentsStr("DbEntity");
        }else if(form.getItemType().equals("dto")){
            form.setTypeParentsStr("SaveBean");
        }
        service.save(form);
        //其他模型绑定应用
        if(VCT.MODEL_TYPE.ENTITY.equals(form.getItemType())&&form.getSysAppId()!=null) {
            List<Form> forms = service.find(QueryWrapper.of(Form.class).eq("entityType", form.getType()).ne("itemType",VCT.MODEL_TYPE.ENTITY));
            forms.forEach(f -> {
                f.setSysAppId(form.getSysAppId());
                service.save(f);
            });
        }
        return form;
    }

    //删除
    @DeleteMapping("/remove/{id}")
    public boolean remove(@PathVariable String id){
        try {
            return service.remove(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }


//    @Override
//    public List<String> remove(String[] ids) {
//        try {
//            return service.remove(id);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return ;
//    }
}
