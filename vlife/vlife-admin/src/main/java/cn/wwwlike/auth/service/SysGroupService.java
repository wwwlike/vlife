package cn.wwwlike.auth.service;

import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.dao.SysGroupDao;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysGroupService extends BaseService<SysGroup, SysGroupDao> {
    @Autowired
    public SysResourcesService resourcesService;

    @Autowired
    public SysGroupService sysGroupService;

    /**
     *
     * @param roleIds 资源对应的角色
     * @param groupRoleIds 单个权限组的角色
     * @return ture:表示权限组能访问
     */
    public boolean hasRole(Set<String> roleIds,List<String> groupRoleIds){
        for(String id:groupRoleIds){
            if(roleIds.contains(id)){
                return true;
            }
        }
        return false;
    }

    /**
     * 所有资源路径与权限组的对应的MAP集合
     * 正向：权限组拥有角色下的资源，且拥有这些资源所在菜单下的main资源
     * 反向：资源对应角色所在的权限组，如果是main资源，那么下级资源对应的角色组也可以访问
     * MAP按照反向思维来做
     * @return
     */
    public Map<String,String> resourceGroupMap(){
        Map<String,String> map=new HashMap();
        //所有资源
        List<SysResources> apiResources=resourcesService.findApiResources();
        //所有权限组
        List<GroupVo> groups= sysGroupService.query(GroupVo.class,new VlifeQuery<SysGroup>());
        apiResources.forEach(res->{
            //该资源关联到的全部角色
            Set<String> roleIds=new HashSet<>();
            roleIds.add(res.getSysRoleId());
            if(res.isMenuRequired()){//菜单主要接口，那么同菜单下其他资源关联的角色也可以访问该资源
                roleIds.addAll(
                    apiResources.stream().filter(r->r.getSysMenuId().equals(res.getSysMenuId())).map(d->d.getSysRoleId()).collect(Collectors.toSet())
                );
            }
            //与资源角色关联的权限组
            Set<String> groupIds=new HashSet<>();
            groupIds.add("super");//manager 虚拟角色名称，给到manger用户上
            groups.stream().forEach(g->{
                roleIds.stream().forEach(roleId->{
                    if(g.getSysRoleGroup_sysRoleId()!=null&&g.getSysRoleGroup_sysRoleId().contains(roleId)){
                        groupIds.add(g.getId());
                    }
                });
            });
            map.put(res.getUrl(),StringUtils.join(groupIds,",") );
        });
        return map;
    }
    /**
     * 所有资源路径与角色组的对应的MAP集合
     * @return
     */
    public Map<String,String> resourceGroupMap1(){
        Map<String,String> map=new HashMap();
        List<SysResources> apiResources=resourcesService.findApiResources();
        // 所有权限组包含角色Id的集合
        List<GroupVo> groups= sysGroupService.query(GroupVo.class,new VlifeQuery<SysGroup>());
        apiResources.forEach(res->{
            //该自己以及下级资源对应的角色id
            Set<String> roleIds=resourcesService.getResourcesAndSubsRoleId(apiResources,res.getCode());
            // 资源所在的角色ID,去找关联的权限组
            List<String> groupIds=groups.stream().filter(group->{
               return hasRole(roleIds,group.getSysRoleGroup_sysRoleId());
            }).map(GroupVo::getId).collect(Collectors.toList());
            map.put(res.getUrl(),StringUtils.join(groupIds,",") );
        });
        return map;
    }


    /**
     * 获得一个权限组下能够访问的资源code
     * 前端用它做权限判断
     * @param groupId 权限组id
     * @return
     */
    public List<String> findGroupResourceCodes(String groupId){
        GroupVo vo=queryOne(GroupVo.class,groupId);
        // 权限组关联的资源
        List<String> code=vo.getSysRoleGroup_sysRole_sysResources_code();
        //权限能访问到的菜单对应的必选资源一并添加
        if(code!=null&&vo.getSysRoleGroup_sysRole_sysResources_sysMenuId()!=null){
            List<String> menuIds=vo.getSysRoleGroup_sysRole_sysResources_sysMenuId();
            List<String> code1=resourcesService.findMenuRequireResources(menuIds.toArray(new String[menuIds.size()]));
            code.addAll(code1);
        }
        return code;
    }

}
