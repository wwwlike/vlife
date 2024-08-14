package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysGroupResourcesDao;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysGroupResources;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class SysGroupResourcesService extends BaseService<SysGroupResources, SysGroupResourcesDao> {
    @Autowired
    public SysGroupService groupService;

    //讲所有role的角色转换成简单模式的权限
    public void tran(){
        List<GroupVo> groupVos=groupService.query(GroupVo.class, QueryWrapper.of(SysGroup.class));
        for(GroupVo groupVo:groupVos)  {
            String  groupId=groupVo.getId();
            if(groupVo.getSysRoleGroup_sysRole_sysResources_id()!=null){
                for(String resourcesId:groupVo.getSysRoleGroup_sysRole_sysResources_id()){
                    SysGroupResources gr=new SysGroupResources();
                    gr.setSysGroupId(groupId);
                    gr.setSysResourcesId(resourcesId);
                    save(gr);
                }
            }
            //菜单
            if(groupVo.getSysRoleGroup_sysRole_sysMenu_id()!=null){
                HashSet<String> set = new HashSet<>(groupVo.getSysRoleGroup_sysRole_sysMenu_id());
                for(String menuId:set){
                    SysGroupResources gr=new SysGroupResources();
                    gr.setSysGroupId(groupId);
                    gr.setSysMenuId(menuId);
                    save(gr);
                }
            }
        }
    }

    //清除作为必选资源的权限组关联
    public void clearMainGroup(String[] requiredResourcesId){
        QueryWrapper qw=QueryWrapper.of(SysGroupResources.class);
        qw.in("sysResourcesId",requiredResourcesId);
        List<SysGroupResources> groupResources=find(qw);
        for(SysGroupResources gr:groupResources){
            remove(gr.getId());
        }
    }
}
