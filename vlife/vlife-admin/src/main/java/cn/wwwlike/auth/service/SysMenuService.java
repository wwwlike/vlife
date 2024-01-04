package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysMenuDao;
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
    /**
     * 找到一个应用的所有菜单
     * @param appId
     * @return
     */
    public List<MenuVo> findAppAllMenu(String appId){
        SysMenu app=findOne(appId);
        return query(MenuVo.class,QueryWrapper.of(SysMenu.class).startsWith("code",app.getCode()));
    }
    /**
     * 查找角色对应的菜单和资源
     * 1 已经绑定当前角色的接口和菜单
     * 2 没有绑定的任何角色的接口和菜单
     * @param roleId
     * @return
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
     * @param menus
     * @return
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
            menus.addAll(queryByIds(MenuVo.class,userResources.stream().map(f->f.getSysMenuId()).collect(Collectors.toList()).toArray(new String[0]))) ;
        }
        return findAllMenu(menus);
    }

    /**
     * 清除指定的菜单角色
     * @param id
     */
    public void clearRoleId(String ...id){
        save("sysRoleId",null,id);
    }


    /**
     * 获得菜单所在应用实体
     * @param menuId
     * @return
     */
    public SysMenu appId(String menuId){
        SysMenu menu=findOne(menuId);
        if(menu.app==true){
            return menu;
        }else{
            return appId(find("code", menu.getPcode()).get(0).getId());
        }
    }


    /**
     * 给所有菜单分配表单
     * @param entities
     */
    public void assignFormToMenu(List<Form> entities){
        List<SysMenu> all=findAll();
        all.stream().filter(m->m.getEntityType()!=null).forEach(m->{
            Optional<Form> optional=entities.stream().filter(f->f.getType().equals(m.getEntityType())).findAny();
            if(optional.isPresent()&&!optional.get().getId().equals(m.getFormId())){
                m.setFormId(optional.get().getId());
                save(m);
            }
        });
    }

}
