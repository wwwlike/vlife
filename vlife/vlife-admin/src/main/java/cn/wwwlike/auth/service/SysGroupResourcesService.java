package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysGroupResourcesDao;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysGroupResources;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SysGroupResourcesService extends BaseService<SysGroupResources, SysGroupResourcesDao> {
    @Autowired
    public SysGroupService groupService;
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysMenuService menuService;

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
    //清除掉没有导入但是有关联数据的resources
    public void clearNoimportResources(){
        List<String> allImportResourcesId=resourcesService.find(QueryWrapper.of(SysResources.class).isNotNull("sysMenuId")).stream().map(SysResources::getId).collect(Collectors.toList());
        List<String> allMenuId=menuService.findAll().stream().map(SysMenu::getId).collect(Collectors.toList());
        List<String> resourcesRelationid=find(QueryWrapper.of(SysGroupResources.class).notIn("sysResourcesId",allImportResourcesId.toArray(new String[0]))).stream().map(SysGroupResources::getId).collect(Collectors.toList());
        //清除未导入接口
        remove(resourcesRelationid.toArray(new String[0]));
        //清除菜单
        List<String> menuRelationid=find(QueryWrapper.of(SysGroupResources.class).notIn("sysMenuId",allMenuId.toArray(new String[0]))).stream().map(SysGroupResources::getId).collect(Collectors.toList());
        remove(menuRelationid.toArray(new String[0]));
    }
}
