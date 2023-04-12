package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysMenuDao;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

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
}
