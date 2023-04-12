package cn.wwwlike.auth.service;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dao.SysResourcesDao;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ApiTag;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.vlife.utils.FileUtil;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
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
     * 所有启用的接口
     * @return
     */
    public List<SysResources> findApiResources(){
        VlifeQuery<SysResources> req=new VlifeQuery<SysResources>(SysResources.class);
        //对有角色关联的资源进行拦截
        req.qw().isNotNull("sysRoleId").eq("state","1"); //0停用，-1未启用
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
       req.qw(SysResources.class)
               .eq("resourcesType",VCT.SYSRESOURCES_TYPE.API)
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

    public List<SysResources> imports(String menuResourcesCode) throws IOException {
        Resource resource = new ClassPathResource("title.json");
        InputStream is = resource.getInputStream();
        String json = FileUtil.getFileContent(is);
        Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
        List<ClzTag> allTag = gson.fromJson(json, new TypeToken<List<ClzTag>>() {
        }.getType());
        List<SysResources> list=new ArrayList();
        for(ClzTag clzTag:allTag){
            if(clzTag.getPath()!=null&&clzTag.getApiTagList()!=null&&
                    clzTag.getApiTagList().size()>0&&
                    (SecurityConfig.getCurrUser().getUsername().equals("manage")||( //过滤掉不该搜索的
                            !clzTag.getTypeName().startsWith("Sys")&&!clzTag.getTypeName().startsWith("Form")
                            ))
            )
                    {
               List<SysResources> menus= find("code",clzTag.getPath().substring(1));
                //菜单待导入
                SysResources menu=null;
                if(menus==null||menus.size()==0){
                    menu=new SysResources();
                    menu.setName(GlobalData.entityDto(clzTag.getTypeName()).getTitle());
                    menu.setCode(clzTag.getPath().substring(1));
                    menu.setId(menu.getCode());
                    if(menuResourcesCode==null||clzTag.getPath().toLowerCase().substring(1).equals(menuResourcesCode.toLowerCase())){
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
                        int index=url.indexOf("/{");
                        if(index>-1){
                            url=url.substring(0,index);
                        }
                        bean.setUrl(url);
                        bean.setPcode(clzTag.getPath().substring(1));
                        bean.setCode(url.substring(1).replaceAll("/",":"));
                        bean.setId(bean.getCode());
                        if(menuResourcesCode==null||bean.getCode().toLowerCase().indexOf(menuResourcesCode.toLowerCase()+":")!=-1){
                            list.add(bean);
                        }
                    }
                }
            }
        }
        return list;
    }

    /**
     * 同步最新接口信息到DB里
     * @return
     * @throws IOException
     */
    public void sync() throws IOException {
        Resource resource = new ClassPathResource("title.json");
        InputStream is = resource.getInputStream();
        String json = FileUtil.getFileContent(is);
        Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
        List<ClzTag> allTag = gson.fromJson(json, new TypeToken<List<ClzTag>>() {
        }.getType());
        List<SysResources> list=new ArrayList();
        List<ClzTag> apitTags=allTag.stream().filter(tag->tag.getPath()!=null&&tag.getApiTagList()!=null&&
                tag.getApiTagList().size()>0).collect(Collectors.toList());
        for(ClzTag action:apitTags){
            syncOne(action);
        }
    }

    public void syncOne(ClzTag action)   {
        List<ApiTag> apis=action.getApiTagList();
        for(ApiTag api:apis){
            String url=(action.getPath()+api.getPath());
            int index=url.indexOf("/{");
            if(index>-1){
                url=url.substring(0,index);
            }
            url=  url.replaceAll("\"","");
//            QueryWrapper<SysResources> wrapper = QueryWrapper.of(entityClz).eq("url",url);
            List<SysResources> list=find("url",url);

            if(list!=null&&list.size()>0){

            }else{
                SysResources bean=new SysResources();
                String menthodName=api.getMethodName();
                menthodName=menthodName.replaceAll("save","保存");
                menthodName=menthodName.replaceAll("add","新增");
                menthodName=menthodName.replaceAll("remove","删除");
                menthodName=menthodName.replaceAll("modify","修改");
                menthodName=menthodName.replaceAll("delete","删除");
                menthodName=menthodName.replaceAll("detail","明细");
                menthodName=menthodName.replaceAll("page","列表");
                menthodName=menthodName.replaceAll("export","导出");
                menthodName=menthodName.replaceAll("sync","同步");
                bean.setName(menthodName);
                bean.setRemark(api.getTitle());
                bean.setUrl(url);
                if(menthodName.indexOf("保存")!=-1)
                    bean.setIcon("IconSave");
                if(menthodName.indexOf("删除")!=-1)
                    bean.setIcon("IconDelete");
                if(menthodName.indexOf("明细")!=-1)
                    bean.setIcon("IconExternalOpen");
                if(menthodName.indexOf("导出")!=-1)
                    bean.setIcon("IconExport");
                if(menthodName.indexOf("同步")!=-1)
                    bean.setIcon("IconSync");
                if(bean.getIcon()==null){
                    bean.setIcon("IconBox");
                }
//                bean.setPcode(api.getPath().substring(1));
                bean.setCode(url.substring(1).replaceAll("/",":"));

//                bean.setResourcesType(VCT.SYSRESOURCES_TYPE.API);
                bean.setState("-1");
                bean.setActionType(action.getEntityName());
                bean.setEntityType(action.getTypeName());
                save(bean);
            }
        }
    }

    /**
     * 获得指定菜单下一定能访问到的资源
     */
    public List<String> findMenuRequireResources(String ...menuIds){
       return findByIds(menuIds).stream().filter(r->r.isMenuRequired()).collect(Collectors.toList()).stream().map(t->t.getCode()).collect(Collectors.toList());
    }
}
