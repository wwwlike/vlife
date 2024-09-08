package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysMenuDao;
import cn.wwwlike.auth.entity.SysGroupResources;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SysMenuService extends BaseService<SysMenu, SysMenuDao> {
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysGroupResourcesService groupResourcesService;
    /**
     * 查找角色对应的菜单和资源
     * 1 已经绑定当前角色的接口和菜单
     * 2 没有绑定的任何角色的接口和菜单
     */
    public List<MenuVo> getMenuVos(String roleId,String appId){
        SysMenu app=findOne(appId);
        QueryWrapper<SysMenu> qw=QueryWrapper.of(SysMenu.class);
        qw.startsWith("pcode",app.getCode());
        List<MenuVo> menuVos=query(MenuVo.class,qw);
        menuVos= menuVos.stream().map(vo -> {
            if(vo.getSysResourcesList()!=null) {
                List<SysResources> filters = vo.getSysResourcesList().stream().filter(resources ->
                        (resources.getSysRoleId() == null || resources.getSysRoleId().equals(roleId))
                ).collect(Collectors.toList());
                vo.setSysResourcesList(filters);
            }
            return vo;
        }).collect(Collectors.toList());
        return menuVos;
    }
    /**
     * 获得指定菜单以及上级菜单
     */
    public List<MenuVo> findAllMenu(List<MenuVo> menus){
        QueryWrapper<SysMenu> qw=QueryWrapper.of(SysMenu.class);
        qw.in("code",menus.stream().filter(m-> StringUtils.isNotEmpty(m.pcode)).map(m->m.pcode).collect(Collectors.toList()).toArray(new String[0]));
        List<MenuVo> parents=query(MenuVo.class,qw);
        if(parents.size()>0){
            menus.addAll(findAllMenu(parents).stream().filter(f->!menus.stream().map(m->m.getId()).collect(Collectors.toList()).contains(f.getId())).collect(Collectors.toList()));
        }
        return menus;
    }
    /**
     * 权限资源对应的所有菜单
     * @param userResources 用户的权限资源
     * @return
     */
    public List<MenuVo> findAllMenusByResources(List<SysResources> userResources){
        List<MenuVo> menus=new ArrayList<>();
        //添加有权限资源对应的菜单
        if(userResources!=null&&userResources.size()>0){
            String[] ids=userResources.stream().filter(r->r.getSysMenuId()!=null).map(f->f.getSysMenuId()).collect(Collectors.toList()).toArray(new String[0]);
            if(ids!=null&&ids.length>0){
                menus.addAll(queryByIds(MenuVo.class,ids)) ;
            }
        }
        return findAllMenu(menus);
    }
    /**
     * 清除指定的菜单角色
     */
    public void clearRoleId(String ...id){
        save("sysRoleId",null,id);
    }
    /**
     * 获得菜单所在应用实体
     * @param menuId
     */
    public SysMenu appId(String menuId){
        SysMenu menu=findOne(menuId);
        if(menu.app==true){
            return menu;
        }else{
            return appId(find("code", menu.getPcode()).get(0).getId());
        }
    }


    //级联删除
    public void relationRemove(String sysMenuId){
        //1. 权限组绑定菜单级联删除 (优化改为采用注解remove搞定)
//        List<SysGroupResources> list=groupResourcesService.find("sysMenuId",sysMenuId);
//        if(list!=null){
//            list.stream().forEach(f->groupResourcesService.delete(f.getId()));
//        }
        List<SysResources> menuResources=resourcesService.find("sysMenuId",sysMenuId);
        for(SysResources resources:menuResources){
//          2. 资源绑定菜单关系解除(采用注解clear处理)
//            resources.setSysMenuId(null);
//            resourcesService.save(resources);
//          3. 菜单删除后则其下资源与权限组绑定的关系一并解除
            List<SysGroupResources> groupResourcesList=groupResourcesService.find("sysResourcesId",resources.getId());
            groupResourcesList.stream().forEach(f->groupResourcesService.delete(f.getId()));


        }
    }
}
