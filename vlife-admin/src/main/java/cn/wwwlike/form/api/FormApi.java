package cn.wwwlike.form.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.req.FormPageReq;
import cn.wwwlike.form.service.FormEventService;
import cn.wwwlike.form.service.FormFieldService;
import cn.wwwlike.form.service.FormReactionService;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.form.vo.*;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.ModelService;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.FileUtil;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import cn.wwwlike.web.security.core.SecurityUser;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.BeanUtils;
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
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
import cn.wwwlike.vlife.ts.ReadTitle;

import javax.servlet.http.HttpServletRequest;

/**
 * 列表字段接口;
 */
@RestController
@RequestMapping("/form")
public class FormApi extends VLifeApi<Form, FormService> {

    @Autowired
    public FormFieldService fieldService;

    @Autowired
    public FormEventService eventService;

    @Autowired
    public FormReactionService reactionService;
    /**
     * 查询后台解析到的模型信息
     * @param req 根究模型类型查询itemType,根据关联的实体名称entityName查询vo,save,req模型
     */
    @GetMapping("/javaModels")
    public  List<BeanDto>  javaModels(FormPageReq req){
        if(req.getEntityType()!=null){
            return ModelService.typeEntityModels(req.getEntityType(),req.getItemType());
        }else if(req.getItemType()!=null) {
            return ModelService.typeModels(req.getItemType());
        }
        return new ArrayList<>();
    }

    @GetMapping("/page")
    public PageVo<Form> page(FormPageReq req){
        return service.findPage(req);
    }

    /**
     * 已启用的模型信息过滤
     * @param req 根究模型类型查询itemType,根据关联的实体名称entityName查询vo,save,req模型
     * @return
     */
    @GetMapping("/list")
    public  List<FormVo> list(FormPageReq req){
        return service.query(FormVo.class,req);
    }

    @Autowired
    private RestTemplateBuilder builder;

    // 使用RestTemplateBuilder来实例化RestTemplate对象，spring默认已经注入了RestTemplateBuilder实例
    @Bean
    public RestTemplate restTemplate() {
        return builder.build();
    }

    @Value("${vlife.packroot}")
    public String packroot;
    /**
     * 生成指定模型代码 local模式
     * @param type
     * @return
     * @throws IOException
     */
    @GetMapping("/tsCode/{type}")
    public String tsCode(@PathVariable String type) throws IOException {
        String json =null;
        Resource resource = new ClassPathResource("title.json");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
//        FileSystemResource fileSystemResource = new FileSystemResource(url);
        if(resource.isFile()) {//开发环境 classpath查找
            InputStream is = resource.getInputStream();
            json = FileUtil.getFileContent(is);

            parts.add("file", resource);
        }else{//生成环境jar包内读取
            Resource[] resources=new PathMatchingResourcePatternResolver().getResources(ResourceUtils.CLASSPATH_URL_PREFIX+"BOOT-INF/classes/title.json");
            parts.add("file", resources[0]);
            json = FileUtil.getFileContent(resources[0].getInputStream());
        }
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(parts, headers);
        ResponseEntity<JSONObject> exchange = null;
        exchange = restTemplate().exchange(packroot+":8288/oa/form/tsCode/remote/"+type, HttpMethod.valueOf("POST"), entity, JSONObject.class);
        return exchange.getBody().get("data").toString();
    }


    /**
     * 模型信息同步
     * 第一次进入系统就应该同步一次
     * Integer数量大于1标识有模型信息发生了变化，前端缓存需要更新
     */
    @GetMapping("/sync")
    public Integer sync(){
        return service.sync(GlobalData.allModels());
    }

    @Autowired
    public SysGroupService groupService;


//    @GetMapping("/model")
//    public FormVo model(FormPageReq req) {
//        SecurityUser currUser= SecurityConfig.getCurrUser();
//        CommonResponseEnum.CANOT_CONTINUE.assertNotNull(req.getType(),"模型标识type没有传入");
//        List<FormVo> published = service.query(FormVo.class, req);
//        BeanDto dto=GlobalData.findBeanDtoByName(req.getItemType(),req.getType());
//        FormVo form = null;
//        if (dto!=null) {
//            if (published != null && published.size() > 0) {
//                form = published.get(0);
//                form.setParentsName(dto.getParentsName());
//            } else if(req.getType()!=null) {
//                form = (FormVo)service.tran(dto);
//            }
//            //查询模型需要过滤掉和行级数据过滤无关的字段
//            if (!req.isDesign()&&form!=null &&VCT.ITEM_TYPE.REQ.equals(form.getItemType())&& currUser.getGroupId()!=null) {
//                SysGroup group=groupService.findOne( currUser.getGroupId());
//                String groupFilterType=group.getFilterType();
//                if(group.getFilterType()!=null&&!"".equals(groupFilterType)&&groupFilterType.split("_").length==2){
//                    String[] filterType=groupFilterType.split("_");
//                    String filterEntityType=filterType[0]; //根据哪个外键过滤
//                    String level=filterType[1];// "1" 本级  2 本级和下级
//                    EntityDto userEntityDto=GlobalData.entityDto("sysUser");
//                    EntityDto reqEntityDto=GlobalData.entityDto(form.entityType);
//                    EntityDto filterEntityDto=GlobalData.entityDto(filterEntityType);
//                    List<String> reqEntityRelationTableNames=reqEntityDto.getRelationFields().stream().map(f->f.getEntityType()).collect(Collectors.toList());
//                    List<String> userFkTableNames=userEntityDto.fields.stream().filter(f->!f.entityType.equals("sysUser")).map(f->f.getEntityType()).collect(Collectors.toList());
//                    form.setFields(service.reqModelFilter(form,reqEntityRelationTableNames,userFkTableNames,filterEntityType,level,
//                            ITree.class.isAssignableFrom( filterEntityDto.getClz())));
//                }
//            }
//        }
//        return form;
//    }
    /**
     * 查询指定模型信息
     * @return
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
            form.setParentsName(dto.getParentsName());
        } else if(req.getType()!=null) {
            dto=GlobalData.findBeanDtoByName(req.getItemType(),req.getType());
            if(dto==null){
                return form;
            }
            form = (FormVo)service.tran(dto);
        }
            //查询模型需要过滤掉和行级数据过滤无关的字段
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
     * 查找Java内存里的模型信息
     * @param modelName 模型名称
     * @return
     */
    @GetMapping("/javaModel/{modelName}")
    public BeanDto javaModel(@PathVariable String modelName) {
        return service.modelInfo(modelName);
    }


    /**
     * 所有实体模型
     *
     * @return
     */
    @RequestMapping("/entityModels")
    public List<FormVo> entityModels() {
        return service.queryAll(FormVo.class).stream().filter(v -> v.getItemType().equals("entity")).collect(Collectors.toList());
    }


    @RequestMapping("/list/all")
    public List<Form> listAll(){
        return  service.find("itemType","entity");
    }

    /**
     * 模型&字段保存
     * @param dto 列表字段;
     * @return 列表字段;
     */
    @PostMapping("/save/formDto")
    public FormVo saveFormDto(@RequestBody FormDto dto) {
        String id = service.save(dto, true).getId();
        FormVo vo = service.queryOne(FormVo.class, id);
        eventService.createHideEvent(dto);//新增隐藏
        eventService.modifyReadEvent(dto); //修改只读
        return vo;
    }

    /**
     * 保存模型
     * 并初始化字段
     */
    @PostMapping("/save")
    public FormDto save(@RequestBody Form dto) {
        FormDto formDto=new FormDto();
        BeanUtils.copyProperties(dto,formDto);
        BeanDto beanDto=GlobalData.findBeanDtoByName(dto.getItemType(),dto.type);
        formDto.setFields(fieldService.getFieldList(beanDto.getFields()));
        return service.save(formDto);
    }

    /**
     * 单个模型信息查询
     */
    @GetMapping("/detail/formVo/{id}")
    public FormVo detailFormVo(@PathVariable String id) {
        return service.queryOne(FormVo.class, id);
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

    /**
     * 模型初始化
     * @return
     */
    @PostMapping("/init/{id}")
    public FormVo init(@PathVariable String id){
       String type=service.deleteModel(id);
       if(type!=null){
           GlobalData.allModels().stream().forEach(m->{
               service.syncOne(m.getType());
           });
       }
       QueryWrapper qw=QueryWrapper.of(Form.class);
       qw.eq("type",type);
       List<FormVo> list= service.query(FormVo.class,qw);
       if(list!=null&& list.size()>0){
           return list.get(0);
       }
       return null;
    }
}
