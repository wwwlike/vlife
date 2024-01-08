package cn.wwwlike.sys.service;

import cn.wwwlike.common.AdminUtils;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.ResourcesType;
import cn.wwwlike.sys.dao.SysResourcesDao;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ApiTag;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.vlife.utils.FileUtil;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
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
    public void resourcesRequired(boolean required,String ...ids){
        findByIds(ids).forEach(r->{
            r.setMenuRequired(required);
        });
    }

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

    /**
     * 失效资源删除
     */
    private void removeExpiredResources(List<String> currResourceIds){
        List<String> dbResourceIds=findAll()
                .stream().map(SysResources::getId).collect(Collectors.toList());
        List<String> deleteIds=
                dbResourceIds.stream().filter(id->!currResourceIds.contains(id)).collect(Collectors.toList());
        batchDel(deleteIds.toArray(new String[0]));
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
     * 1. 失效的删除掉；
     * @return
     * @throws IOException
     */
    public void sync() throws IOException {
        List<String> currResourceIds=new ArrayList<>();
        List<ClzTag> apitTags= AdminUtils.readApiFile();//
        apitTags.forEach(clzTag -> { currResourceIds.addAll(syncOne(clzTag));});
        removeExpiredResources(currResourceIds);
        assignFormToResource();
        createRelationship();
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

    /**
     * 单个接口资源同步
     * @param action
     */
    public List<String> syncOne(ClzTag action)   {
        List<String> resourceIds=new ArrayList<>();
        List<ApiTag> apis=action.getApiTagList();
        //资源更新或者新增
        for(ApiTag api:apis){
            String apiPath=api.getPath();
            String url=getApiUrl(action.getPath()+apiPath);
            List<SysResources> list=find("url",url);
            SysResources bean=list.size()>0?list.get(0):new SysResources();
//            资源里包含或者等于以下路径开头的为系统类型的接口，所有以它开头的都划归与它，避免用户选择接口太多
            String menthodName=api.getMethodName();
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
            save(bean);
            resourceIds.add(bean.getId());
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


    /**
     * 获得指定菜单下一定能访问到的资源
     */
    public List<String> findMenuRequireResources(String ...menuIds){
       return findByIds(menuIds).stream().filter(r->r.isMenuRequired()).collect(Collectors.toList()).stream().map(t->t.getCode()).collect(Collectors.toList());
    }


    /**
     * 批量将指定接口纳入到权限管理state->1
     */
    public void batchStateUseState(List<String> ids){
//        List<SysResources> all=findAll();
//        all.forEach(sysResources -> {
//            if(ids.contains(sysResources.getId())&&sysResources.getState().equals(CT.STATE.DISABLE)){
//                sysResources.setState(CT.STATE.NORMAL);
//                save(sysResources);
//            }else if(!ids.contains(sysResources.getId())&&sysResources.getState().equals(CT.STATE.NORMAL)){
//                sysResources.setState(CT.STATE.DISABLE);
//                save(sysResources);
//            }
//        });
    }

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
}
