package cn.wwwlike.sys.api;
import cn.vlife.utils.VlifePathUtils;
import cn.wwwlike.sys.entity.FormField;
import cn.wwwlike.sys.entity.SysApp;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysAppService;
import cn.wwwlike.sys.service.SysMenuService;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.req.FormPageReq;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.FileUtil;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.io.InputStream;
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
    @Value("${vlife.packroot}")
    public String packroot;
    @Value("${vlife.generatorPackRoot}")
    public String generatorPackRoot;
    @Autowired
    public SysResourcesService resourcesService;

    /**
     * 所有模型
     * model=true
     */
    @VMethod(permission = PermissionEnum.noAuth)
    @PostMapping("/list/model")
    public List<FormDto> listModel(@RequestBody FormPageReq req){
        return service.query(FormDto.class,req);
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
     * 模型发布
     * 提交
     */
    @PostMapping("/publish")
    public FormDto publish(@RequestBody FormDto dto){
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(!VlifePathUtils.isRunningFromJar(),"当前生产环境，不支持模型设计");
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
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(!VlifePathUtils.isRunningFromJar(),"当前生产环境，不支持模型设计");
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



}
