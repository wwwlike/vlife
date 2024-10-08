package cn.wwwlike.sys.service;

import cn.wwwlike.auth.dao.SysGroupResourcesDao;
import cn.wwwlike.auth.entity.SysGroupResources;
import cn.wwwlike.common.AdminUtils;
import cn.wwwlike.form.IForm;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.ResourcesType;
import cn.wwwlike.sys.dao.SysResourcesDao;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ApiTag;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SysResourcesService extends VLifeService<SysResources, SysResourcesDao> {

    @Autowired
    public FormService formService;

    /**
     * 获得指定资源(角色的资源)关联pcode的所有资源信息
     * @param codes 角色的资源code
     * @return 一个角色能关联到的所有资源信息
     */
    public List<SysResources> findApiResources(List<SysResources> all, String ... codes){
        List<SysResources> list=new ArrayList<>();
        for(String code:codes){
           SysResources resources= all.stream().filter(res->res.getCode().equals(code)).findFirst().get();
           list.add(resources);
           if(StringUtils.isNotEmpty(resources.getCode())){
               if(!resources.getCode().equals(resources.getPcode())){
                list.addAll(findApiResources(all,resources.getPcode()));
               }
           }
        }
        return list;
    }

    public Set<String> getResourcesAndSubsRoleId(List<SysResources> all, String code){
        Set<String> set=new HashSet<>();
        set.add(all.stream().filter(res->res.getCode().equals(code)).findFirst().get().getSysRoleId());
        all.stream().filter(res->code.equals(res.getCode())).forEach(res->{
           set.addAll(getResourcesAndSubsRoleId(all,res.getCode()));
        });
        return set;
    }

    /**
     * 关联了菜单的资源为启用资源
     */
    public List<SysResources> findApiResources(){
        VlifeQuery<SysResources> req=new VlifeQuery<SysResources>(SysResources.class);
        req.qw().isNotNull("sysMenuId");
        return find(req);
    }

    /**
     * 获得菜单资源编码
     * @param codes
     * @return
     */
    public List<SysResources> findMenuResource(List<SysResources> all, String ... codes){
        List<SysResources> allApiResources=findApiResources(all,codes);
        Set<String> menus=allApiResources.stream()
                .filter(res->res.getPcode()==null)
                .map(SysResources::getCode).collect(Collectors.toSet());

        return all.stream().filter(res->menus.contains(res.getCode())).collect(Collectors.toList());
    }

    /**
     * 查询未关联角色的资源
     * @return
     */
    public List<SysResources> findRoleEmptyResources(){
       VlifeQuery<SysResources> req= new VlifeQuery(SysResources.class);
       req.qw(SysResources.class).isNull("sysRoleId");
       return find(req);
    }

    /**
     * 获得角色可编辑的所有资源
     * @param resources 角色绑定的资源
     * @return
     */
    public List<SysResources> findRoleAllResources(List<SysResources> resources){
        resources.addAll(findRoleEmptyResources());//空角色资源
        String[] codes=resources.stream().map(SysResources::getCode).collect(Collectors.toList()).toArray(new String[resources.size()]);
        resources.addAll(findMenuResource(findAll(),codes));//加入菜单
        return resources;
    }

    /**
     * 指定角色下菜单编码的SET集合
     * @param roleId
     * @return
     */
    public Set<String> getMenuCode(String... roleId){
        QueryWrapper<SysResources> wrapper = QueryWrapper.of(entityClz).in("sysRoleId", roleId);
        List<SysResources> resources= dao.find(wrapper);
        return resources.stream().map(SysResources::getPcode).collect(Collectors.toSet());
    }

    //设置指定资源的菜单必须访问状态
//    public void resourcesRequired(boolean required,String ...ids){
//        findByIds(ids).forEach(r->{
//            r.setMenuRequired(required);
//        });
//    }

    /**
     * 得到菜单下能够访问formId的下的所有资源
     * （没绑和已绑定当前menuId)且不是子权限(pcode===null)的所有资源
     * @param formId
     * @param sysMenuId
     * @return
     */
    public List<SysResources> menuUseableResources(String formId,String sysMenuId){
        List<SysResources> rs= find("formId",formId);
        return rs.stream().filter(
                sysResources ->(
                        sysResources.getSysMenuId()==null||
                                sysMenuId.equals(sysResources.getSysMenuId()))
                        && ("single".equals(sysResources.getPermission())||("extend".equals(sysResources.getPermission())&&sysResources.getPcode()==null))
        ).collect(Collectors.toList());
    }

    //查找菜单下资源所在api类里的所有查询类的接口
    public List<SysResources> findQueryResources(List<SysResources> groupResources){
        //得到所有api类
        String[] actionTypes = groupResources.stream()
                .map(g -> g.getActionType())
                .collect(Collectors.toSet()) // 使用 Set 来确保唯一性
                .toArray(new String[0]);

        QueryWrapper<SysResources> qw=QueryWrapper.of(SysResources.class);
        qw.in("actionType",actionTypes).ne("permission","noAuth").ne("permission","single").or(w->w.eq("paramType","req").startsWith("methedType","@GetMapping"));
        return find(qw);
    }

    /**

     * 将模型与资源进行关联
     */
    private void assignFormToResource(){
        List<Form> forms=formService.find("itemType","entity");
        List<SysResources> resources=find(QueryWrapper.of(SysResources.class).isNull("formId").isNotNull("entityType"));
        resources.forEach(r->{
            List<Form> fList=forms.stream().filter(f->f.getEntityType().toLowerCase().equals(r.getEntityType().toLowerCase())).collect(Collectors.toList());
            if(fList!=null&&fList.size()>0){
                r.setFormId(fList.get(0).getId());
                save(r);
            }
        });
    }

    //开启所有资源
    private void enableAllResources(){
        List<SysResources> resources=find(QueryWrapper.of(SysResources.class).eq("state","2"));
        for(SysResources _r:resources){
            _r.setState("1");
            save(_r);
        }
    }

    /**
     * 计算资源上下级关系
     */
    private void createRelationship(){
        List<SysResources> all=findAll();
        List<SysResources>  sub=all.stream().filter(r->r.getCode().split(":").length==3).collect(Collectors.toList());
        sub.forEach(r->{
            String[] code=r.getCode().split(":");
            String parentCode=code[0]+":"+code[1];
            Optional  optional=all.stream().filter(r1->r1.getCode().equals(parentCode)).findFirst();
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
     * 同步最新接口信息到DB里
     * 失效的删除掉|资源关联模型|资源上下级关系塑造；
     * @return
     * @throws IOException
     */
    public void sync() throws IOException {
        List<String> currResourceIds=new ArrayList<>();
        List<ClzTag> apitTags= AdminUtils.readApiFile();
        //1. 所有导入的资源
        List<SysResources> dbResources=find(QueryWrapper.of(SysResources.class).or(eq->eq.isNull("custom",Form.class).eq("custom",false,Form.class)));
        //2. 目前还启用的导入资源
        apitTags.forEach(clzTag -> { currResourceIds.addAll(syncOne(clzTag,dbResources));});
        List<String> deleteIds=
                dbResources.stream().filter(r->!currResourceIds.contains(r.getId())).map(DbEntity::getId).collect(Collectors.toList());
        batchDel(deleteIds.toArray(new String[0]));
        assignFormToResource();
        createRelationship();
        enableAllResources();
    }

    //计算取出path实际的接口地址
    public String getApiUrl(String url){
        int index=url.indexOf("/{");
        if(index>-1){
            url=url.substring(0,index);
        }
        url=  url.replaceAll("\"","");
        return url;
    }

    public static boolean startsWithAny(String A, List<String> B) {
        // 遍历集合 B
        for (String prefix : B) {
            // 判断 A 是否以 prefix 开头
            if (A.startsWith(prefix)) {
                return true; // 如果是，返回 true
            }
        }
        return false; // 如果没有匹配项，返回 false
    }

    /**
     * 单个接口资源同步
     * @param action
     */
    public List<String> syncOne(ClzTag action,List<SysResources> dbResources)   {
        List<String> resourceIds=new ArrayList<>();
        try{
        List<ApiTag> apis=action.getApiTagList();
        //资源更新或者新增
        for(ApiTag api:apis){
            String apiPath=api.getPath();
            String url=getApiUrl(action.getPath()+apiPath);
            List<SysResources> list=dbResources.stream().filter(db->url.equals(db.getUrl())).collect(Collectors.toList());
            SysResources bean=list.size()>0?list.get(0):new SysResources();
            //以下三个变化则跟新资源
            if(bean.getId()!=null){
                String  currPermission=api.getPermission()!=null?api.getPermission().name(): PermissionEnum.extend.name();
                String currName=api.getTitle();
                String currRemark=api.getRemark();
                int i=0;
                if(currPermission!=null&&!currPermission.equals(bean.getPermission())){
                   bean.setPermission(currPermission);
                   i++;
                }
                if(currName!=null&&!currName.equals(bean.getName())){
                    bean.setName(currName);
                    bean.setJavaName(currName);
                    i++;
                }
                if(currRemark!=null&&!currRemark.equals(bean.getRemark())){
                    bean.setRemark(currRemark);
                    i++;
                }

                Pattern pattern = Pattern.compile("(\\w+)<(\\w+)>");
                if(api.getParamWrapper()!=null){
                    Matcher matcher = pattern.matcher(api.getParamWrapper());
                    if(!api.getParam().equals(bean.getParam())){
                        bean.setParam(api.getParam());
                        i++;
                    }
                    if (matcher.find()) {
                        // 获取类名和泛型参数
                        String className = matcher.group(1);
                        String genericType = matcher.group(2);
                        if(!className.equals(bean.getParamWrapper())||bean.getParamType()==null){
                            bean.setParamWrapper(className);
                            bean.setParamType(
                                    startsWithAny(api.getParamWrapper(),GlobalData.entityNames)?"entity":
                                    startsWithAny(api.getParamWrapper(),GlobalData.dtoNames)?"dto":
                                    startsWithAny(api.getParamWrapper(),GlobalData.voNames)?"vo":
                                    startsWithAny(api.getParamWrapper(),GlobalData.reqNames) ?"req":"other"
                            );
                            i++;
                        }
                        if(!genericType.equals(bean.getParamGeneric())){
                            i++;
                            bean.setParamGeneric(genericType);
                        }
                    } else {
                        if(!api.getParamWrapper().equals(bean.getParamWrapper())||bean.getParamType()==null){
                            bean.setParamWrapper(api.getParamWrapper());
                            bean.setParamType(
                                    startsWithAny(api.getParamWrapper(),GlobalData.entityNames)?"entity":
                                            startsWithAny(api.getParamWrapper(),GlobalData.dtoNames)?"dto":
                                                    startsWithAny(api.getParamWrapper(),GlobalData.voNames)?"vo":
                                                            startsWithAny(api.getParamWrapper(),GlobalData.reqNames) ?"req":"other"
                            );
                            i++;
                        }
                    }
                }
                if(api.getReturnClz()!=null){
                    Matcher returnMatcher = pattern.matcher(api.getReturnClz());
                    if (returnMatcher.find()) {
                        String className = returnMatcher.group(1);
                        String genericType = returnMatcher.group(2);
                        if(!className.equals(bean.getReturnClz())||bean.getReturnType()==null){
                            bean.setReturnClz(className);
                            bean.setParamType(
                                    startsWithAny(api.getParamWrapper(),GlobalData.entityNames)?"entity":
                                            startsWithAny(api.getParamWrapper(),GlobalData.dtoNames)?"dto":
                                                    startsWithAny(api.getParamWrapper(),GlobalData.voNames)?"vo":
                                                            startsWithAny(api.getParamWrapper(),GlobalData.reqNames) ?"req":"other"
                            );
                            i++;
                        }
                        if(!genericType.equals(bean.getReturnGeneric())){
                            i++;
                            bean.setReturnGeneric(genericType);
                        }
                    }else{
                        if((bean.getReturnClz()!=null&&!bean.getReturnClz().equals(api.getReturnClz()))||(bean.getReturnClz()==null&& api.getReturnClz()!=null)){
                            bean.setReturnClz(api.getReturnClz());
                            bean.setParamType(
                                    startsWithAny(api.getParamWrapper(),GlobalData.entityNames)?"entity":
                                            startsWithAny(api.getParamWrapper(),GlobalData.dtoNames)?"dto":
                                                    startsWithAny(api.getParamWrapper(),GlobalData.voNames)?"vo":
                                                            startsWithAny(api.getParamWrapper(),GlobalData.reqNames) ?"req":"other"
                            );
                            i++;
                        }

                    }
                }
                if(i>0){
                    save(bean);
                }
            }else{
                // 资源里包含或者等于以下路径开头的为系统类型的接口，所有以它开头的都划归给它，避免用户选择接口太多
                // 意思就是 /sysUser/list /sysUser/listAge  只纳入一个接口进行管理
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
                bean.setRemark(api.getRemark());
                bean.setUrl(url);
                bean.setCode(url.substring(1).replaceAll("/",":"));
                bean.setPermission(api.getPermission()!=null?api.getPermission().name(): PermissionEnum.extend.name());
                bean.setActionType(action.getEntityName());
                bean.setMethedType(api.getMethodType());
                bean.setEntityType(action.getTypeName());
                Pattern pattern = Pattern.compile("(\\w+)<(\\w+)>");
                if(api.getParamWrapper()!=null){
                    Matcher matcher = pattern.matcher(api.getParamWrapper());
                    bean.setParam(api.getParam());
                    bean.setParamType(
                            startsWithAny(api.getParamWrapper(),GlobalData.entityNames)?"entity":
                                    startsWithAny(api.getParamWrapper(),GlobalData.dtoNames)?"dto":
                                            startsWithAny(api.getParamWrapper(),GlobalData.voNames)?"vo":
                                                    startsWithAny(api.getParamWrapper(),GlobalData.reqNames) ?"req":"other"
                    );

                    if (matcher.find()) {
                        // 获取类名和泛型参数
                        String className = matcher.group(1);
                        String genericType = matcher.group(2);
                        bean.setParamWrapper(className);
                        bean.setParamGeneric(genericType);
                        //                    System.out.println("Class Name: " + className);
                        //                    System.out.println("Generic Type: " + genericType);
                    } else {
                        bean.setParamWrapper(api.getParamWrapper());
                    }
                }
                if(api.getReturnClz()!=null){
                    Matcher returnMatcher = pattern.matcher(api.getReturnClz());
                    if (returnMatcher.find()) {
                        String className = returnMatcher.group(1);
                        String genericType = returnMatcher.group(2);
                        bean.setReturnClz(className);
                        bean.setParamType(
                                startsWithAny(api.getParamWrapper(),GlobalData.entityNames)?"entity":
                                        startsWithAny(api.getParamWrapper(),GlobalData.dtoNames)?"dto":
                                                startsWithAny(api.getParamWrapper(),GlobalData.voNames)?"vo":
                                                        startsWithAny(api.getParamWrapper(),GlobalData.reqNames) ?"req":"other"
                        );
                        bean.setReturnGeneric(genericType);
                    }else{
                        bean.setReturnClz(api.getReturnClz());
                    }
                }
                save(bean);
            }
            resourceIds.add(bean.getId());
        }

        }catch (Exception e){
            e.printStackTrace();
        }

        return resourceIds;
    }

    public static String findTitleString(String input) {
        if(input==null){
            return "";
        }
        int start = input.indexOf('*');
        int end = -1;

        if (start != -1) {
            end = input.indexOf('*', start + 1);
            if (end != -1) {
                return input.substring(start + 1, end);
            }
        }
        start = input.indexOf("//");
        if (start != -1) {
            end = input.indexOf("//", start + 2);
            if (end != -1) {
                return input.substring(start + 2, end);
            } else {
                return input.substring(start + 2);
            }
        }
        return input;
    }

//    /**
//     * 获得指定菜单下一定能访问到的资源
//     */
//    public List<String> findMenuRequireResources(String ...menuIds){
//       return findByIds(menuIds).stream().filter(r->r.isMenuRequired()).collect(Collectors.toList()).stream().map(t->t.getCode()).collect(Collectors.toList());
//    }

    /**
     * 当资源与菜单取消关联那么也清空它和角色的关联
     */
    public void clearRoleWithMenuEmpty(){
        List<SysResources> resources=find(QueryWrapper.of(SysResources.class).isNull("sysMenuId").isNotNull("sysRoleId"));
        resources.forEach(r->{
            r.setSysRoleId(null);
            save(r);
        });
    }

    /**
     *  过滤出按钮可以绑定的接口
     */
    public List<SysResources> buttonFilter(List<SysResources> resources){
        //分页返回查询接口过滤掉
        resources=resources.stream().filter(
                r->!"PageVo".equals(r.getReturnClz())&&
                        !"PageQuery".equals(r.getParamWrapper())&&
                        !"CustomQuery".equals(r.getParamWrapper())&&
                        r.getMethedType().indexOf("GetMapping")==-1
        ).collect(Collectors.toList());
        //查询模型作为入参的接口过滤掉
        List<String> reqModelNames=GlobalData.getReqDtos().keySet().stream().map(t->t.getSimpleName()).collect(Collectors.toList());
        resources=resources.stream().filter(r->!reqModelNames.contains(r.getParamWrapper())).collect(Collectors.toList());
        //无入参但是出参是List集合的过滤掉
        resources=resources.stream().filter(r->!(r.getReturnClz()!=null&&r.getReturnClz().equals("List")&&r.getParamWrapper()==null)).collect(Collectors.toList());
        return resources;
    }

    //初始化一个实体的最进本接口
    public void initEntityApi(IForm iForm){
        String entityType=StringUtils.uncapitalize(iForm.getType());
        String actionType=StringUtils.capitalize(entityType)+"API";
        String formId=iForm.getId();
        String rootUrl="/"+entityType+"/";
        SysResources detail=new SysResources("详情",entityType,formId,actionType,entityType+":detail",null,
                "@GetMapping(\"/detail\")","detail","extend",rootUrl+"detail","other","String[]");
        SysResources save=new SysResources("保存",entityType,formId,actionType,entityType+":save","IconSave",
                "@PostMapping(\"/save\")","save","extend",rootUrl+"save","entity",entityType);
        SysResources page=new SysResources("查询",entityType,formId,actionType,entityType+":page",null,
                "@PostMapping(\"/page\")","page","extend",rootUrl+"page","req",entityType);
        SysResources remove=new SysResources("删除",entityType,formId,actionType,entityType+":remove","IconDelete",
                "@DeleteMapping(\"/remove\")","delete","extend",rootUrl+"remove","other","String[]");
       if(find("url",detail.getUrl()).size()==0){
        save(detail);
       }
        if(find("url",save.getUrl()).size()==0) {
            save(save);
        }
        if(find("url",save.getUrl()).size()==0) {
            save(save);
        }
        if(find("url",page.getUrl()).size()==0) {
            save(page);
        }
        if(find("url",remove.getUrl()).size()==0) {
            save(remove);
        }
    }

    // 查找与权限组有关联但是和菜单里未导入到菜单的资源
    public List<SysResources> findGroupResourcesWithoutImportMenu(){
       return null;
    }
}
