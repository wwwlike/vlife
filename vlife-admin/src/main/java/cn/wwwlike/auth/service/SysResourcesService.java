package cn.wwwlike.auth.service;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dao.SysResourcesDao;
import cn.wwwlike.auth.dto.ResourcesDto;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ApiTag;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysResourcesService extends BaseService<SysResources, SysResourcesDao> {

    /**
     * 获得指定资源(角色的资源)关联pcode的所有资源信息
     * @param codes 角色的资源code
     * @return 一个角色能关联到的所有资源信息
     */
    public List<SysResources> findApiResources(List<SysResources> all, String ... codes){
        List<SysResources> list=new ArrayList<>();
        for(String code:codes){
           SysResources resources= all.stream().filter(res->res.resourcesCode.equals(code)).findFirst().get();
           list.add(resources);
           if(StringUtils.isNotEmpty(resources.getResourcesPcode())){
               if(!resources.getResourcesCode().equals(resources.getResourcesPcode())){
                list.addAll(findApiResources(all,resources.getResourcesPcode()));
               }
           }
        }
        return list;
    }

    public Set<String> getResourcesAndSubsRoleId(List<SysResources> all, String code){
        Set<String> set=new HashSet<>();
        set.add(all.stream().filter(res->res.getResourcesCode().equals(code)).findFirst().get().getSysRoleId());
        all.stream().filter(res->code.equals(res.getResourcesPcode())).forEach(res->{
           set.addAll(getResourcesAndSubsRoleId(all,res.getResourcesCode()));
        });
        return set;
    }

    public List<SysResources> findApiResources(){
        VlifeQuery<SysResources> req=new VlifeQuery<SysResources>(SysResources.class);
        //对有角色关联的资源进行拦截
        req.qw().isNotNull("sysRoleId").eq("type", VCT.SYSRESOURCES_TYPE.API);
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
                .filter(res->res.getMenuCode()!=null)
                .map(SysResources::getMenuCode).collect(Collectors.toSet());

        return all.stream().filter(res->menus.contains(res.resourcesCode)).collect(Collectors.toList());
    }

    /**
     * 查询未关联角色的资源
     * @return
     */
    public List<SysResources> findRoleEmptyResources(){
       VlifeQuery<SysResources> req= new VlifeQuery(SysResources.class);
       req.qw(SysResources.class)
               .eq("type",VCT.SYSRESOURCES_TYPE.API)
               .isNull("sysRoleId");
       return find(req);
    }

    /**
     * 获得角色可编辑的所有资源
     * @param resources 角色绑定的资源
     * @return
     */
    public List<SysResources> findRoleAllResources(List<SysResources> resources){
        resources.addAll(findRoleEmptyResources());//空角色资源
        String[] codes=resources.stream().map(SysResources::getResourcesCode).collect(Collectors.toList()).toArray(new String[resources.size()]);
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
        return resources.stream().map(SysResources::getMenuCode).collect(Collectors.toSet());
    }

    public List<SysResources> imports(List<ClzTag> allTag,String search){
        List<SysResources> list=new ArrayList();
        for(ClzTag clzTag:allTag){
            if(clzTag.getPath()!=null&&clzTag.getApiTagList()!=null&&
                    clzTag.getApiTagList().size()>0&&
                    (SecurityConfig.getCurrUser().getUsername().equals("manage")||( //过滤掉不该搜索的
                            !clzTag.getTypeName().startsWith("Sys")&&!clzTag.getTypeName().startsWith("Form")
                            ))
            )
                    {
               List<SysResources> menus= find("resourcesCode",clzTag.getPath().substring(1));
                //菜单待导入
                SysResources menu=null;
                if(menus==null||menus.size()==0){
                    menu=new SysResources();
                    menu.setName(GlobalData.entityDto(clzTag.getTypeName()).getTitle());
                    menu.setResourcesCode(clzTag.getPath().substring(1));
                    menu.setType(VCT.SYSRESOURCES_TYPE.MENU);
                    menu.setId(menu.getResourcesCode());
                    if(search==null||clzTag.getPath().toLowerCase().indexOf(search.toLowerCase())!=-1){
                        list.add(menu);
                    }
                }else{
                    menu=menus.get(0);
                }
                //接口待导入
                for(ApiTag apiTag:clzTag.getApiTagList()){
                    String url=(clzTag.getPath()+apiTag.getPath());
                    int indexBegin=url.indexOf("/{");
                    if(indexBegin!=-1){
                        url=url.substring(0,indexBegin);
                    }
                    if(find("url",url).size()==0){
                        SysResources bean=new SysResources();
                        String menthodName=apiTag.getMethodName();
                        menthodName=menthodName.replaceAll("save","保存");
                        menthodName=menthodName.replaceAll("add","新增");
                        menthodName=menthodName.replaceAll("remove","删除");
                        menthodName=menthodName.replaceAll("modify","修改");
                        menthodName=menthodName.replaceAll("delete","删除");
                        menthodName=menthodName.replaceAll("detail","明细");
                        menthodName=menthodName.replaceAll("page","查询");
                        menthodName=menthodName.replaceAll("page","列表");
                        bean.setName(menthodName);
                        bean.setUrl(url);
                        bean.setMenuCode(clzTag.getPath().substring(1));
                        bean.setResourcesCode(url.substring(1).replaceAll("/",":"));
                        bean.setType(VCT.SYSRESOURCES_TYPE.API);
                        bean.setId(bean.getResourcesCode());
                        if(search==null||bean.getResourcesCode().toLowerCase().indexOf(search.toLowerCase())!=-1){
                            list.add(bean);
                        }
                    }
                }
            }
        }
        return list;
    }
}
