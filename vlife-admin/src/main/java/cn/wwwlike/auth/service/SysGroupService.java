package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysGroupDao;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.auth.vo.SysFilterVo;
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
     * 所有资源路径与角色组的对应的MAP集合
     * @return
     */
    public Map<String,String> resourceGroupMap(){
        Map<String,String> map=new HashMap();
        List<SysResources> apiResources=resourcesService.findApiResources();
        // 所有权限组包含角色Id的集合
        List<GroupVo> groups= sysGroupService.query(GroupVo.class,new VlifeQuery<SysGroup>());
        apiResources.forEach(res->{
            //该自己以及下级资源对应的角色id
            Set<String> roleIds=resourcesService.getResourcesAndSubsRoleId(apiResources,res.getResourcesCode());
            // 资源所在的角色ID,去找关联的权限组
            List<String> groupIds=groups.stream().filter(group->{
               return hasRole(roleIds,group.getSysRoleGroup_sysRoleId());
            }).map(GroupVo::getId).collect(Collectors.toList());
            map.put(res.getUrl(),StringUtils.join(groupIds,",") );
        });
        return map;
    }

}
