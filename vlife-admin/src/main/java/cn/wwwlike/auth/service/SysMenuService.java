package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysMenuDao;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SysMenuService extends BaseService<SysMenu, SysMenuDao> {

    /**
     * 查找角色对应的菜单和资源
     * @param roleId
     * @return
     */
    public List<MenuVo> getMenuVos(String roleId){
        List<MenuVo> menuVos=queryAll(MenuVo.class);
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
    public List<SysMenu> findAllMenu(List<SysMenu> menus){
        QueryWrapper<SysMenu> qw=QueryWrapper.of(SysMenu.class);
        qw.in("code",menus.stream().filter(m-> StringUtils.isNotEmpty(m.pcode)).map(m->m.pcode).collect(Collectors.toList()).toArray(new String[0]));
        List<SysMenu> parents=find(qw);
        if(parents.size()>0){
            menus.addAll(findAllMenu(parents).stream().filter(f->!menus.stream().map(m->m.getId()).collect(Collectors.toList()).contains(f.getId())).collect(Collectors.toList()));
        }
        return menus;
    }

    @Autowired
    public SysResourcesService resourcesService;
    /**
     * 查找没有绑定任何资源的菜单
     * @return
     */
    public List<SysMenu> findMenuWithoutResources(){
        List<SysResources> allResources=resourcesService.findAll();//所有权限资源
        //需要鉴权菜单id集合
        List<String> resourceMenuIds=allResources.stream().filter(r->r.getSysMenuId()!=null).map(f->f.getSysMenuId()).collect(Collectors.toList());
        QueryWrapper<SysMenu> qw=QueryWrapper.of(SysMenu.class);
        List<SysMenu> pageMenus=find(qw.isNotNull("url"));//所有有路由地址的菜单
        List<SysMenu> withoutResourcesMenus=pageMenus.stream().filter(f->!resourceMenuIds.contains(f.getId())).collect(Collectors.toList());
        return findAllMenu(withoutResourcesMenus);
    }


    /**
     * 权限资源对应的所有菜单
     * @param userResources 用户的权限资源
     * @return
     */
    public List<SysMenu> findAllMenusByResources(List<SysResources> userResources){
        List<SysMenu> menus=new ArrayList<>();
        //添加有权限资源对应的菜单
        if(userResources!=null&&userResources.size()>0){
            menus.addAll(findByIds(userResources.stream().map(f->f.getSysMenuId()).collect(Collectors.toList()).toArray(new String[0]))) ;
        }
        //没有权限的那一部分菜单加进来
        menus.addAll(findMenuWithoutResources());
        return findAllMenu(menus);
    }
}
