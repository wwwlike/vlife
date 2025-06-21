package cn.wwwlike.sys.service;

import cn.vlife.generator.TitleJson;
import cn.vlife.utils.VlifePathUtils;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.common.ResourcesType;
import cn.wwwlike.sys.dao.SysResourcesDao;
import cn.wwwlike.sys.entity.SysApp;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ApiTag;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.FileUtil;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysResourcesService extends VLifeService<SysResources, SysResourcesDao> {
    @Autowired
    public FormService formService;
    @Autowired
    public SysAppService appService;

    /**
     * 查找菜单下资源所在api类里的所有查询类的接口
     */
    public List<SysResources> findQueryResources(List<SysResources> groupResources){
        //得到所有api类
        String[] actionTypes = groupResources.stream()
                .map(g -> g.getActionType())
                .collect(Collectors.toSet())
                .toArray(new String[0]);
        QueryWrapper<SysResources> qw=QueryWrapper.of(SysResources.class);
        qw.in("actionType",actionTypes).ne("permission",CT.RESOURCES_PERMISSION.NOAUTH).ne("permission",CT.RESOURCES_PERMISSION.SINGLE)
                .or(w->w.eq("paramType","req").startsWith("methedType","@GetMapping"));
        return find(qw);
    }

    /**
     * 将模型与资源进行关联
     * formId 与 paramType 字段赋值
     */
    public void assignFormToResource(){
        List<Form> all=formService.findAll();
        List<Form> entityForms=all.stream().filter(f->f.getItemType().equals(VCT.MODEL_TYPE.ENTITY)).collect(Collectors.toList());
        List<Form> dtoForms=all.stream().filter(f->f.getItemType().equals(VCT.MODEL_TYPE.DTO)).collect(Collectors.toList());
        List<Form> reqForms=all.stream().filter(f->f.getItemType().equals(VCT.MODEL_TYPE.REQ)).collect(Collectors.toList());

        List<SysResources> resources=find(QueryWrapper.of(SysResources.class).isNull("formId").isNotNull("entityType"));
        resources.forEach(r->{
            List<Form> fList=entityForms.stream().filter(f->f.getType().toLowerCase().equals(r.getEntityType().toLowerCase())).collect(Collectors.toList());
            if(fList!=null&&fList.size()>0){
                r.setFormId(fList.get(0).getId());
                save(r);
            }
        });
        resources=find(QueryWrapper.of(SysResources.class).isNull("paramType"));
        resources.forEach(r->{
            if(r.getParamWrapper()!=null){
                boolean paramTypeIsEntity=entityForms.stream().filter(f->f.getType().toLowerCase().equals(r.getParamWrapper().toLowerCase())).count()>0;
                boolean paramTypeIsDto=dtoForms.stream().filter(f->f.getType().toLowerCase().equals(r.getParamWrapper().toLowerCase())).count()>0;
                boolean paramTypeIsReq=reqForms.stream().filter(f->f.getType().toLowerCase().equals(r.getParamWrapper().toLowerCase())).count()>0;
                if(paramTypeIsEntity){
                    r.setParamType("entity");
                }else if (paramTypeIsDto){
                    r.setParamType("dto");
                }else if (paramTypeIsReq||r.getParamWrapper().equals("VlifeQuery")||r.getParamWrapper().equals("CustomQuery")||r.getParamWrapper().equals("PageQuery")){
                    r.setParamType("req");
                }else{
                    r.setParamType("other");
                }
            }else{
                r.setParamType("other");
            }
            save(r);
        });
    }

    /**
     * 通过物理模型同步接口信息(开发环境&&标准版以上)
     */
    public void sync() throws IOException {
        if (!VlifePathUtils.isRunningFromJar()) {
            List<String> currResourceIds = new ArrayList<>();
            List<SysResources> dbResources = findAll();
            // 1. 物理类删除的同时接口信息同步删除
            Iterator<SysResources> iterator = dbResources.iterator();
            while (iterator.hasNext()) {
                SysResources resource = iterator.next();
                if (resource.getFullClassName() != null && resource.getMethodName() != null && !apiExist(resource.getFullClassName(), resource.getMethodName())) {
                    iterator.remove();  // 使用迭代器的 remove 方法安全地删除元素
                    delete(resource.getId()); // 删除数据库中相应的资源
                }
            }
            // 2. 同步接口信息(物理文件读取)
            //List<ClzTag> apitTags= readApiByJsonFile();(老的方式json文件)
            List<ClzTag> apitTags = TitleJson.getJavaClzTag().stream().filter(tag->tag.getPath()!=null).collect(Collectors.toList());
            apitTags.forEach(clzTag -> {
                currResourceIds.addAll(syncOne(clzTag, true, dbResources));
                FormDto form=formService.getModelByType(clzTag.getTypeName());
                createDefaultResources(form);
            });
            // 3. 关系构建，状态维护
            assignFormToResource();//4. 添加formId值
            createRelationship();//  5. 上下级关系pcode创建
            enableAllResources();// 6. 开启所有资源
        }
    }


    /**
     * 资源接口同步
     * @param action javaParser读取到的接口信息
     * @param checkMethodExist 是否检查class文件加载没有
     */
    public List<String> syncOne(ClzTag action,Boolean checkMethodExist){
        return syncOne(action,checkMethodExist,null);
    }

    /**
     * 单action控制层资源同步
     */
    public List<String> syncOne(ClzTag action,Boolean checkMethodExist,List<SysResources> dbResources)   {
        if(dbResources==null){
            dbResources=findAll();
        }
        List<String> resourceIds=new ArrayList<>();
        try{
        List<ApiTag> apis=action.getApiTagList();
        //资源更新或者新增
        for(ApiTag api:apis){
            String apiPath=api.getPath();
            String apiUrl=getApiUrl(action.getPath()+apiPath);
            List<SysResources> list=dbResources.stream().filter(db->apiUrl.equals(db.getUrl())).collect(Collectors.toList());
            SysResources bean=list.size()>0?list.get(0):new SysResources();
            String fullClassName=action.getPackageName()+"."+action.getEntityName();
            String methodName=api.getMethodName();
            if(checkMethodExist==false||apiExist(fullClassName,methodName)){
                if(bean.getId()!=null){
                    //更新
                    String  currPermission=api.getPermission()!=null?api.getPermission().name(): PermissionEnum.extend.name();
                    String currName=api.getTitle();
                    String currRemark=api.getRemark();
                    int i=0;
                    if(shouldUpdateParam(bean.getFullClassName(),fullClassName)){
                        bean.setFullClassName(fullClassName);
                        i++;
                    }
                    if(shouldUpdateParam(bean.getMethodName(),methodName)){
                        bean.setMethodName(methodName);
                        i++;
                    }
                    if(shouldUpdateParam(bean.getPermission(),currPermission)){
                       bean.setPermission(currPermission);
                       i++;
                    }
                    if(shouldUpdateParam(bean.getName(),currName)){
                        bean.setName(currName);
                        bean.setJavaName(currName);
                        i++;
                    }
                    if(shouldUpdateParam(bean.getRemark(),currRemark)){
                        bean.setRemark(currRemark);
                        i++;
                    }
                    if(shouldUpdateParam(bean.getParam(),api.getParam())){
                        bean.setParam(api.getParam());
                        i++;
                    }
                    if(shouldUpdateParam(bean.getParamWrapper(),api.getParamWrapper())){
                        bean.setParamWrapper(api.getParamWrapper());
                        i++;
                    }
                    if(shouldUpdateParam(bean.getParamGeneric(),api.getParamGeneric())){
                        bean.setParamGeneric(api.getParamGeneric());
                        i++;
                    }
                    if(shouldUpdateParam(bean.getReturnWrapper(),api.getReturnWrapper())){
                        bean.setReturnWrapper(api.getReturnWrapper());
                        i++;
                    }
                    if(shouldUpdateParam(bean.getReturnGeneric(),api.getReturnGeneric())){
                        bean.setReturnGeneric(api.getReturnGeneric());
                        i++;
                    }
                    if(shouldUpdateParam(bean.getParamAnnotation(),api.getParamAnnotation())){
                        bean.setParamAnnotation(api.getParamAnnotation());
                        i++;
                    }
                    if(i>0){
                        save(bean);
                    }
                }else{
                    String formId=formService.getModelByType(action.getTypeName()).getId();
                    // 资源里包含或者等于以下路径开头的为系统类型的接口，所有以它开头的都划归给它，避免用户选择接口太多
                    // 意思是 /sysUser/list /sysUser/listAge  只纳入一个接口进行管理
                    Optional<ResourcesType> optional=
                            ResourcesType.resourcesTypeList()
                                    .stream()
                                    .filter(r->apiPath.startsWith("/"+r.pathPrefix)).findAny();
                    if(optional.isPresent()){
                        bean.setResourceType(optional.get().getPathPrefix());
                        bean.setIcon(optional.get().getIcon());
                    }else{
                        bean.setResourceType("other");
                        bean.setIcon("IconBytedanceLogo");
                    }
                    bean.setName(api.getTitle());
                    bean.setJavaName(api.getTitle());
                    bean.setMethodName(methodName);
                    bean.setFullClassName(fullClassName);
                    bean.setRemark(api.getRemark());
                    bean.setUrl(apiUrl);
                    bean.setCode(apiUrl.substring(1).replaceAll("/",":"));
                    bean.setPermission(api.getPermission()!=null?api.getPermission().name(): PermissionEnum.extend.name());
                    bean.setActionType(action.getEntityName());
                    bean.setMethedType(api.getMethodType());
                    bean.setEntityType(action.getTypeName());
                    bean.setParam(api.getParam());
                    bean.setParamType(null);
                    bean.setParamGeneric(api.getParamGeneric());
                    bean.setParamWrapper(api.getParamWrapper());
                    bean.setParamAnnotation(api.getParamAnnotation());
                    bean.setReturnGeneric(api.getReturnGeneric());
                    bean.setReturnWrapper(api.getReturnWrapper());
                    //不检查方法是否存在则为2
                    bean.setState(checkMethodExist==false?"2":"1");
                    bean.setFormId(formId);
                    save(bean);
                }
                resourceIds.add(bean.getId());
            }
        }}catch (Exception e){
            e.printStackTrace();
        }
        return resourceIds;
    }

    /**
     *  过滤出按钮可以绑定的接口
     */
    public List<SysResources> buttonFilter(List<SysResources> resources){
        //分页返回查询接口过滤掉
        resources=resources.stream().filter(
                r->!"PageVo".equals(r.getReturnWrapper())&&
                        !"PageQuery".equals(r.getParamWrapper())&&
                        !"CustomQuery".equals(r.getParamWrapper())&&
                        r.getMethedType().indexOf("GetMapping")==-1
        ).collect(Collectors.toList());
        //查询模型作为入参的接口过滤掉
        List<String> reqModelNames=GlobalData.getReqDtos().keySet().stream().map(t->t.getSimpleName()).collect(Collectors.toList());
        resources=resources.stream().filter(r->!reqModelNames.contains(r.getParamWrapper())).collect(Collectors.toList());
        //无入参但是出参是List集合的过滤掉
        resources=resources.stream().filter(r->!(r.getReturnWrapper()!=null&&r.getReturnWrapper().equals("List")&&r.getParamWrapper()==null)).collect(Collectors.toList());
        return resources;
    }

    /**
     * 通过模型标识删除关联接口
     */
    public void removeByModelType(String modelType){
        QueryWrapper<SysResources> queryWrapper=QueryWrapper.of(SysResources.class)
                .or(s->s.eq("returnWrapper",modelType).eq("paramWrapper",modelType).eq("returnGeneric",modelType).eq("returnGeneric",modelType));
        find(queryWrapper).forEach(sysResources -> {
            delete(sysResources.getId());
        });
    }

    /**
     * 开启所有资源
     */
    private void enableAllResources(){
        List<SysResources> resources=find(QueryWrapper.of(SysResources.class).or(w->w.eq("state","2").isNull("state")));
        for(SysResources _r:resources){
            _r.setState("1");
            save(_r);
        }
    }

    /**
     * 计算资源上下级关系
     */
    public void createRelationship(){
        List<SysResources> all=findAll();
        List<SysResources>  sub=all.stream().filter(r->r.getCode()!=null&&r.getCode().split(":").length==3).collect(Collectors.toList());
        sub.forEach(r->{
            String[] code=r.getCode().split(":");
            String parentCode=code[0]+":"+code[1];
            Optional  optional=all.stream().filter(r1->r1.getCode()!=null&&r1.getCode().equals(parentCode)).findFirst();
            if(optional.isPresent()&&r.getPcode()==null){
                r.setPcode(parentCode);
                save(r);
            }else if(optional.isPresent()==false&&r.getPcode()!=null){
                r.setPcode(null);
                save(r);
            }
        });
    }

    /**
     * 判断字段是否需要更新
     */
    private boolean shouldUpdateParam(String beanParam, String apiParam) {
        if((beanParam==null||"".equals(beanParam))&&(apiParam==null||"".equals(apiParam))) {
            return false;
        }
        return (beanParam == null && apiParam != null) ||
                (beanParam != null && !beanParam.equals(apiParam));
    }

    //计算取出path实际的接口地址
    private String getApiUrl(String url){
        int index=url.indexOf("/{");
        if(index>-1){
            url=url.substring(0,index);
        }
        url=  url.replaceAll("\"","");
        return url;
    }

    /**
     * 物理方法检查指定类接口是否存在
     */
    private boolean apiExist(String fullClassName,String methodName){
        try {
            Class<?> clazz = Class.forName(fullClassName);
            for (java.lang.reflect.Method method : clazz.getMethods()) {
                if (method.getName().equals(methodName)) {
                    return true;
                }
            }
        } catch (NullPointerException e) {
            return false;
        }catch (ClassNotFoundException e) {
            return false;
        }
        return false;
    }

    /**
     * 接口信息提取
     * 有自定义方法的接口
     */
    private List<ClzTag>  readApiByJsonFile() throws IOException {
        InputStream is =null;
        try{
            String projectBaseDir = System.getProperty("user.dir");
            String filePath = projectBaseDir + "/vlife-admin/src/main/resources/";
            filePath = filePath + "/title.json";
            File file = new File(filePath);
            is= new FileInputStream(file);
        }catch (Exception ex){

        }
        String json = FileUtil.getFileContent(is);
        Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
        List<ClzTag> allTag = gson.fromJson(json, new TypeToken<List<ClzTag>>() {
        }.getType());
        List<ClzTag> apitTags=allTag.stream().filter(tag->tag.getPath()!=null&&tag.getApiTagList()!=null&&
                tag.getApiTagList().size()>0).collect(Collectors.toList());
        return  apitTags;
    }

    /**
     * 接口是否已经定义
     */
    public boolean exist(String formId,String methodName){
       return count(QueryWrapper.of(SysResources.class).eq("formId",formId).eq("methodName",methodName))>0;
    }

    @Value("${vlife.generatorPackRoot}")
    public String generatorPackRoot;

    /**
     * 创建指定模型的
     * @param formDto
     */
    public void createDefaultResources(FormDto formDto){
        if(formDto!=null){
            SysApp app=appService.findOne(formDto.getSysAppId());
            if(app!=null){
                String packname=app.getAppKey().equals("sys")?"cn.wwwlike":generatorPackRoot;
                String fullClassName=packname+"."+app.getAppKey()+".api."+StringUtils.capitalize(formDto.getType())+"Api";
                addCreateResource(formDto,fullClassName);
                addModifyResource(formDto,fullClassName);
                addRemoveSysResource(formDto,fullClassName);
            }else{
                throw new RuntimeException(formDto.getType()+"模型所属应用不存在,请检查");
            }
        }
    }

    //添加系统保存接口资源
    private void addCreateResource(FormDto formDto,String fullClassName){
        String formId=formDto.getId();
        if(!exist(formId,"create")) {
            SysResources bean = new SysResources();
            bean.setName("新增");
            bean.setJavaName("新增");
            bean.setMethodName("create");
            bean.setUrl("/"+formDto.getType()+"/create");
            bean.setPermission(PermissionEnum.extend.name());
            bean.setMethedType("@PostMapping(\"/create\")");
            bean.setEntityType(formDto.getEntityType());
            bean.setParam("dto");//参数名
            bean.setParamType(formDto.getItemType());
            bean.setParamGeneric(null);
            bean.setParamWrapper(formDto.getType());
            bean.setParamAnnotation("RequestBody");
            bean.setReturnGeneric(null);
            bean.setIcon("IconPlusStroked");
            bean.setReturnWrapper(formDto.getType());
            bean.setState("1");
            bean.setFormId(formDto.getId());
            bean.setActionType(StringUtils.capitalize(formDto.getType())+"Api");
            bean.setFullClassName(fullClassName);
            save(bean);
        }
    }

    //添加系统数据更新接口资源
    private void addModifyResource(FormDto formDto,String fullClassName){
        if(!exist(formDto.getId(),"edit")) {
            SysResources bean = new SysResources();
            bean.setName("修改");
            bean.setJavaName("修改");
            bean.setMethodName("edit");
            bean.setUrl("/"+formDto.getType()+"/edit");
            bean.setPermission(PermissionEnum.extend.name());
            bean.setMethedType("@PostMapping(\"/edit\")");
            bean.setEntityType(formDto.getEntityType());
            bean.setParam("dto");//参数名
            bean.setIcon("IconSave");
            bean.setParamType(formDto.getItemType());
            bean.setParamWrapper(formDto.getType());
            bean.setParamAnnotation("RequestBody");
            bean.setReturnWrapper(formDto.getType());
            bean.setState("1");
            bean.setFormId(formDto.getId());
            bean.setActionType(StringUtils.capitalize(formDto.getType())+"Api");
            bean.setFullClassName(fullClassName);
            save(bean);
        }
    }

    //添加先删除接口
    private void addRemoveSysResource(FormDto formDto,String fullClassName){
        if(!exist(formDto.getId(),"remove")) {
            SysResources bean = new SysResources();
            bean.setName("删除");
            bean.setJavaName("删除");
            bean.setMethodName("remove");
            bean.setUrl("/"+formDto.getType()+"/remove");
            bean.setPermission(PermissionEnum.extend.name());
            bean.setIcon("IconDelete");
            bean.setMethedType("@DeleteMapping(\"/remove\")");
            bean.setEntityType(formDto.getEntityType());
            bean.setParam("ids");//参数名
            bean.setParamType("other");
            bean.setParamWrapper("String[]");
            bean.setParamAnnotation("RequestBody");
            bean.setReturnWrapper("Long");
            bean.setReturnType("Long");
            bean.setState("1");
            bean.setFormId(formDto.getId());
            bean.setActionType(StringUtils.capitalize(formDto.getType())+"Api");
            bean.setFullClassName(fullClassName);
            save(bean);
        }
    }

}
