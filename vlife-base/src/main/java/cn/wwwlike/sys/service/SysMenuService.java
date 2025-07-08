package cn.wwwlike.sys.service;

import cn.wwwlike.sys.common.AuthDict;
import cn.wwwlike.sys.dao.SysMenuDao;
import cn.wwwlike.sys.dto.MenuCrudDto;
import cn.wwwlike.sys.dto.MenuGroupDto;
import cn.wwwlike.sys.dto.SysTabDto;
import cn.wwwlike.sys.entity.*;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.vo.UserDetailVo;
import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysMenuService extends BaseService<SysMenu, SysMenuDao> {
    @Autowired
    public SysTabService tabService;
    @Autowired
    public SysAppService appService;
    @Value("${vlife.generatorPackRoot}")
    public String generatorPackRoot;
    @Autowired
    public ButtonService buttonService;
    /**
     * 根据包名查询默认对应的应用id
     * cn.vlife.erp.entity.Customer 系统规范里倒数第三个 erp应该为应用 sysMenu->appKey;
     */
    public String getAppIdByTypeClass(String typeClass){
        String[] parts = typeClass.split("\\.");
        if (parts.length >= 3) {
            String appKey = parts[parts.length - 3];
            List<SysApp> apps=appService.find(QueryWrapper.of(SysApp.class).eq("appKey",appKey));
            if(apps!=null&&apps.size()>0){
                return apps.get(0).getId();
            }
        }
        return null;
    }

    /**
     * 指定应用的模型包名计算
     * @param appId 应用
     * @param itemType 模型类型
     * @param type 模型标识名
     * @return 包名&类名
     */
    public String typeClass(String appId,String itemType,String type){
        SysApp app=appService.findOne(appId);
        String appKey=app.getAppKey();
        return generatorPackRoot+"."+appKey+"."+itemType+"."+ org.springframework.util.StringUtils.capitalize(type);
    }

    /**
     * 递归查询所有菜单项，包括指定菜单项的父菜单。
     * @param menus 初始菜单列表，包含了需要查询的菜单项
     * @return 返回一个包含所有相关菜单项的列表，包括输入菜单及其所有父菜单
     */
    public List<SysMenu> findAllMenu(List<SysMenu> menus){
        QueryWrapper<SysMenu> qw=QueryWrapper.of(SysMenu.class);
        qw.in("code",menus.stream().filter(m-> StringUtils.isNotEmpty(m.pcode)).map(m->m.pcode).collect(Collectors.toList()).toArray(new String[0]));
        List<SysMenu> parents=find(qw);
        if(parents.size()>0){
            menus.addAll(findAllMenu(parents).stream().filter(f->!menus.stream().map(m->m.getId()).collect(Collectors.toList()).contains(f.getId())).collect(Collectors.toList()));
        }
        return menus;
    }

    @Override
    public SysMenu save(SysMenu dto) {
//        if(StringUtils.isNotEmpty(dto.getUrl())){
//            dto.setPageLayoutId(null);
//        }
        SysMenu menu= dao.save(dto);
        Form form=formService.findOne(menu.getFormId());
        if(AuthDict.PAGE_TYPE.crudPage.equals(menu.getPageType())&&form.getSysMenuId()==null){
           form.setSysMenuId(menu.getId());//模型关联菜单
           formService.save(form);
        }
        return menu;
    }


    @Override
    public <E extends IdBean> E saveBean(E dto, boolean isFull) {
        if(dto.getClass()== MenuCrudDto.class){
            MenuCrudDto _dto=(MenuCrudDto) dto;
            super.saveBean(_dto,true);
            Form form=formService.findOne(_dto.getFormId());
            if(AuthDict.PAGE_TYPE.crudPage.equals(_dto.getPageType())&&form.getSysMenuId()==null){
                form.setSysMenuId(_dto.getId());//模型关联菜单
                formService.save(form);
            }
            return (E) _dto;
        }
        return dto;
    }

    @Override
    public List<String> remove(String... ids) throws Exception {
        return super.remove(ids);
    }

    //根据页签绑定的访问权限对象查询可以访问的菜单(给到前端的)
    List<SysMenu> findMenusUser(UserDetailVo userDetailVo){
        List<String> sysGroupIds=userDetailVo.getSysUserGroup_sysGroup().stream().map(DbEntity::getId).collect(Collectors.toList());
        //增删改查里有权限的菜单
        List<SysMenu> crudMenus= find(QueryWrapper.of(SysMenu.class).andSub( SysTab.class,qw->qw.andSub(SysTabVisit.class,qw2->qw2.in("sysGroupId",sysGroupIds.toArray(new String[0])))));
        //chart菜单加入
        for(String groupId:sysGroupIds){
           List<SysMenu> _chartMenus= find(QueryWrapper.of(SysMenu.class).like("groupIds","%"+groupId+"%"));
           if(_chartMenus!=null&&_chartMenus.size()>0){
               crudMenus.addAll(_chartMenus);
           }
        }
        return crudMenus;
    }

    /**
     * 获得所有crud菜单类型的访问授权(page接口)map映射集合
     */
    public Map<String, Set<String>> curdMenuPageApiVisits(){
        List<SysMenu> crudMenus=find("pageType", AuthDict.PAGE_TYPE.crudPage);
        List<SysTabDto> allTabs=tabService.queryAll(SysTabDto.class);//所有视图(绑定授权对象visit)
        Map<String,Set<String>> map=new HashMap<>();// map->key：菜单列表的；value:菜单下所有页签支持的访问角色
        for(SysMenu crudMenu:crudMenus){
            //列表模型
            Form form=formService.findOne(crudMenu.getFormId());
            //菜单授权对象集合
            Set<String> visits=new HashSet<>();
            map.put("/"+form.getType()+"/page",visits);
            //菜单页签
            List<SysTabDto>  menuTabs= allTabs.stream().filter(f->f.getSysMenuId().equals(crudMenu.getId())).collect(Collectors.toList());
            for(SysTabDto tab:menuTabs){
                //遍历页签，提取页签对应的授权对象
                if(tab.getSysTabVisits()!=null){
                    for(SysTabVisit visitDto:tab.getSysTabVisits()){
                        if(visitDto.getSysGroupId()!=null){
                            visits.add(visitDto.getSysGroupId());
                        }else if(visitDto.getSysDeptId()!=null){
                            visits.add(visitDto.getSysDeptId());
                        }else if(visitDto.getSysUserId()!=null){
                            visits.add(visitDto.getSysUserId());
                        }
                    }
                }
            }
        }
        return map;
    }

    @Override
    public <E extends SaveBean<SysMenu>> E save(E saveBean, boolean isFull) {
       if(saveBean.getId()==null){
           if(saveBean instanceof MenuCrudDto){
               MenuCrudDto menuCrudDto=(MenuCrudDto) saveBean;
               menuCrudDto.setSort(getSort(menuCrudDto.getSysAppId(),menuCrudDto.getPcode()));
           }else if(saveBean instanceof MenuGroupDto){
                MenuGroupDto menuGroupDto=(MenuGroupDto) saveBean;
                menuGroupDto.setSort(getSort(menuGroupDto.getSysAppId(),menuGroupDto.getPcode()));
           }
       }
        return super.save(saveBean, isFull);
    }

    public Integer getSort(String appId, String pcode){
        List<SysMenu> menus=null;
        if(pcode==null){
            menus=find(QueryWrapper.of(SysMenu.class).eq("sysAppId",appId).isNull("pcode"));
        }else{
            menus= find(QueryWrapper.of(SysMenu.class).eq("sysAppId",appId).eq("pcode",pcode));
        }
        if(menus==null||menus.size()==0){
            return 1;
        }
        return menus.stream().mapToInt(m->m.getSort()).max().getAsInt()+1;
    }
}
