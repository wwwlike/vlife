package cn.wwwlike.form.api;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.common.BatchModifyDto;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.req.FormPageReq;
import cn.wwwlike.form.service.FormEventService;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.FileUtil;
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

/**
 * 模型接口
 */
@RestController
@RequestMapping("/form")
public class FormApi extends VLifeApi<Form, FormService> {
    @Autowired
    public FormEventService eventService;
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
     * 模型保存
     * 和工作流有关的进行工作流发布
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

    /**
     * 应用归集
     */
    @PostMapping("/assignType")
    public Integer  assignType(@RequestBody  BatchModifyDto dto){
        return service.assignType(dto);
    }

}
