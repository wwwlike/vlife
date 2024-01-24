package cn.wwwlike.form.api;
import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.form.req.FormPageReq;
import cn.wwwlike.form.service.FormEventService;
import cn.wwwlike.form.service.FormFieldService;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.FileUtil;
import cn.wwwlike.web.security.core.SecurityUser;
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
    public FormFieldService fieldService;
    @Autowired
    public FormEventService eventService;
    @Autowired
    public SysGroupService groupService;
    @Autowired
    private RestTemplateBuilder builder;
    @Autowired
    public SysMenuService menuService;
    //spring默认已经注入了RestTemplateBuilder实例
    @Bean
    public RestTemplate restTemplate() {
        return builder.build();
    }
    @Value("${vlife.packroot}")
    public String packroot;

    /**
     * 模型查询
     */
    @PostMapping("/list")
    public List<FormVo> list(@RequestBody FormPageReq req){
        return service.query(FormVo.class,req);
    }

    /**
     * 请求TS代码
     */
    @GetMapping("/tsCode/{type}")
    public String tsCode(@PathVariable String type) throws IOException {
        String json =null;
        Resource resource = new ClassPathResource("title.json");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        if(resource.isFile()) {//开发环境 classpath查找
            InputStream is = resource.getInputStream();
            json = FileUtil.getFileContent(is);
            parts.add("file", resource);
        }else{//生产环境jar包内读取
            Resource[] resources=new PathMatchingResourcePatternResolver().getResources(ResourceUtils.CLASSPATH_URL_PREFIX+"BOOT-INF/classes/title.json");
            parts.add("file", resources[0]);
            json = FileUtil.getFileContent(resources[0].getInputStream());
        }
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(parts, headers);
        ResponseEntity<JSONObject> exchange = null;
        //取前端代码
        exchange = restTemplate().exchange(packroot+"/tsCode/code/"+type, HttpMethod.valueOf("POST"), entity, JSONObject.class);
        return exchange.getBody().get("data").toString();
    }

    /**
     * 模型详情
     * 查找父组件以及模型父类
     */
    @GetMapping("/model")
    public FormVo model(FormPageReq req) {
        SecurityUser currUser= SecurityConfig.getCurrUser();
        List<FormVo> published = service.query(FormVo.class, req);
        FormVo form = null;
        BeanDto dto=null;
        if (published != null && published.size() > 0) {
            dto=  GlobalData.findBeanDtoByName(published.get(0).getItemType(),published.get(0).getType());
            if(dto==null){
                return form;
            }
            form = published.get(0);
            List<FormField> fields=  fieldService.find("fieldType",form.getType());
            if(fields!=null&&fields.size()>0){
                String [] parentFormIds=fields.stream().map(FormField::getFormId).toArray(String[]::new);
                form.setParentForm(service.queryByIds(FormVo.class,parentFormIds));
            }
            form.setParentsName(dto.getParentsName());
        } else if(req.getType()!=null) {
            dto=GlobalData.findBeanDtoByName(req.getItemType(),req.getType());
            if(dto==null){
                return form;
            }
            form = (FormVo)service.tran(dto);
        }
        //查询模型req需要过滤掉和行级数据过滤无关的字段
        if (!req.isDesign()&&form!=null &&VCT.ITEM_TYPE.REQ.equals(form.getItemType())&& currUser.getGroupId()!=null) {
            SysGroup group=groupService.findOne( currUser.getGroupId());
            String groupFilterType=group.getFilterType();
            if(group.getFilterType()!=null&&!"".equals(groupFilterType)&&groupFilterType.split("_").length==2){
                String[] filterType=groupFilterType.split("_");
                String filterEntityType=filterType[0]; //根据哪个外键过滤
                String level=filterType[1];// "1" 本级  2 本级和下级
                EntityDto userEntityDto=GlobalData.entityDto("sysUser");
                EntityDto reqEntityDto=GlobalData.entityDto(form.entityType);
                EntityDto filterEntityDto=GlobalData.entityDto(filterEntityType);
                List<String> reqEntityRelationTableNames=reqEntityDto.getRelationFields().stream().map(f->f.getEntityType()).collect(Collectors.toList());
                List<String> userFkTableNames=userEntityDto.fields.stream().filter(f->!f.entityType.equals("sysUser")).map(f->f.getEntityType()).collect(Collectors.toList());
                form.setFields(service.reqModelFilter(form,reqEntityRelationTableNames,userFkTableNames,filterEntityType,level,
                        ITree.class.isAssignableFrom( filterEntityDto.getClz())));
            }
        }
        return form;
    }

    /**
     * 模型保存
     */
    @PostMapping("/save/formDto")
    public FormVo saveFormDto(@RequestBody FormDto dto) {
        dto=service.syncDictCode(dto); //字典修改后更新field
        String id = service.save(dto, true).getId();
        FormVo vo = service.queryOne(FormVo.class, id);
        eventService.createHideEvent(dto);//新增隐藏
        eventService.modifyReadEvent(dto); //修改只读
        return vo;
    }

    /**
     * 模型分类
     */
    @PostMapping("/save")
    public Form save(@RequestBody Form form) {
        service.save(form);
        //与实体相关的模型也一同归类
        if(form.getItemType().equals("entity")&&form.getSysMenuId()!=null) {
            List<Form> forms = service.find(QueryWrapper.of(Form.class).eq("entityType", form.getType()).ne("itemType","entity"));
            forms.forEach(f -> {
                f.setSysMenuId(form.getSysMenuId());
                service.save(f);
            });
        }
        return form;
    }

}
