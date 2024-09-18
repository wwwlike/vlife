package cn.wwwlike.auth.service;

import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.dao.SysGroupDao;
import cn.wwwlike.auth.entity.SysGroupResources;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.query.QueryWrapper;
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
    @Autowired
    public SysGroupResourcesService sysGroupResourcesService;

    /**
     * 所有资源路径与权限组的对应的MAP集合
     * {"url1":"group1,group2","url2":"group3,group2"}
     */
    public Map<String,String> resourceGroupMap(){
        Map<String,String> map=new HashMap();
        //所有资源
        List<SysResources> allResources=resourcesService.findAll();
        //所有参与权限控制的资源资源
        List<SysResources> apiResources=allResources.stream().filter(res->res.getSysMenuId()!=null).collect(Collectors.toList());
        //所有权限组
        List<GroupVo> groups= sysGroupService.queryAll(GroupVo.class);
        apiResources.forEach(res->{
            //该资源关联到的全部角色
            Set<String> roleIds=new HashSet<>();
            roleIds.add(res.getSysRoleId());
//            if(res.isMenuRequired()){//菜单主要接口，那么同菜单下其他资源关联的角色也可以访问该资源
//                roleIds.addAll(
//                    apiResources.stream().filter(r->r.getSysMenuId().equals(res.getSysMenuId())).map(d->d.getSysRoleId()).collect(Collectors.toSet())
//                );
//            }
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
            map.put(res.getUrl(),StringUtils.join(groupIds,","));
            //当前资源的子资源(子资源时通过路径url确定的)过滤到后也添加到相同的权限组
            List<SysResources> extendRresources=allResources.stream().filter(r->res.getCode().equals(r.getPcode())).filter(r->r.permission.equals(PermissionEnum.extend.name())).collect(Collectors.toList());
            if(extendRresources!=null&&extendRresources.size()>0){
                extendRresources.forEach(subResources->{
                    map.put(subResources.getUrl(),StringUtils.join(groupIds,","));
                });
            }
        });
        return map;
    }


    /**
     * 无角色简单版权限组资源关联
     * @return
     */
//    public Map<String,String> noRoleResourceGroupMap(){
//        Map<String,String> map=new HashMap();
//        //所有资源
//        List<SysResources> allResources=resourcesService.findAll();
//        //所有参与权限控制的资源资源
//        List<SysResources> apiResources=allResources.stream().filter(res->res.getSysMenuId()!=null).collect(Collectors.toList());
//        //所有权限组
//        apiResources.forEach(res->{
//           final Set<String> groupIds=new HashSet<>();
//            if(res.isMenuRequired()){
//                //主要所在菜单下的其他资源绑定的group权限组集合
//                String[] optResourcesArray = allResources.stream()
//                        .filter(r -> res.getSysMenuId().equals(r.getSysMenuId()) && !r.isMenuRequired())
//                        .map(DbEntity::getId)
//                        .toArray(String[]::new);
//                QueryWrapper<SysGroupResources> qw=QueryWrapper.of(SysGroupResources.class).in("sysResourcesId",optResourcesArray);
//                groupIds.addAll(sysGroupResourcesService.find(qw).stream().map(SysGroupResources::getSysGroupId).collect(Collectors.toSet()));
//            }else{
//                groupIds.addAll(sysGroupResourcesService.find("sysResourcesId",res.getId()).stream().map(SysGroupResources::getSysGroupId).collect(Collectors.toSet()));
//            }
//            groupIds.add("super");//manager 虚拟角色名称，给到manger用户上
//            map.put(res.getUrl(),StringUtils.join(groupIds,","));
//            //当前资源的子资源(子资源时通过路径url确定的)过滤到后也添加到相同的权限组
//            List<SysResources> extendRresources=allResources.stream().filter(r->res.getCode().equals(r.getPcode())).filter(r->r.permission.equals(PermissionEnum.extend.name())).collect(Collectors.toList());
//            if(extendRresources!=null&&extendRresources.size()>0){
//                extendRresources.forEach(subResources->{
//                    map.put(subResources.getUrl(),StringUtils.join(groupIds,","));
//                });
//            }
//        });
//        return map;
//    }

//    /**
//     * 获得一个权限组下能够访问的资源code
//     * 前端用它做权限判断
//     */
//    public List<String> findGroupResourceCodes(String groupId){
//        GroupVo vo=queryOne(GroupVo.class,groupId);
//        // 权限组关联的资源
//        List<String> code=vo.getSysRoleGroup_sysRole_sysResources_code();
//        //权限能访问到的菜单对应的必选资源一并添加
//        if(code!=null&&vo.getSysRoleGroup_sysRole_sysResources_sysMenuId()!=null){
//            List<String> menuIds=vo.getSysRoleGroup_sysRole_sysResources_sysMenuId();
//            List<String> code1=resourcesService.findMenuRequireResources(menuIds.toArray(new String[menuIds.size()]));
//            code.addAll(code1);
//        }
//        return code;
//    }



    /**
     * 查找所有纳入权限控制的接口以及他们与权限组的关联关系的绑定情况
     */
    public Map<String,String> securityMap(){
        //类与权限组的绑定关系
        Map<String,Set<String>> actionTypeGroupMap=new HashMap();
        Map<String,String> securityMap=new HashMap();
        //所有资源
        List<SysResources> allResources=resourcesService.findAll();
        //与菜单绑定的参与权限控制的资源
        List<SysResources> apiResources=allResources.stream().filter(res->res.getSysMenuId()!=null).collect(Collectors.toList());
        //所有api里的查询类型接口
        List<SysResources> reqResources=resourcesService.find(QueryWrapper.of(SysResources.class).ne("permission","noAuth").ne("permission","single").or(w->w.eq("paramType","req").startsWith("methedType","@GetMapping")));
        List<GroupVo> groups= sysGroupService.queryAll(GroupVo.class);        //所有权限组
        apiResources.forEach(res->{
            //接口关联的权限组
            final Set<String> groupIds=new HashSet<>();
            groupIds.addAll(sysGroupResourcesService.find("sysResourcesId",res.getId()).stream().map(SysGroupResources::getSysGroupId).collect(Collectors.toSet()));
            groupIds.add("super");//manager 虚拟角色名称，给到manger用户上
            if(actionTypeGroupMap.get(res.getActionType())==null){
                actionTypeGroupMap.put(res.getActionType(),groupIds);
            }else{
                actionTypeGroupMap.get(res.getActionType()).addAll(groupIds);
            }
            String groupStr=StringUtils.join(groupIds,",");
            securityMap.put(res.getUrl(),groupStr);
            //子资源绑定与父资源相同权限组
            List<SysResources> extendRresources=allResources.stream().filter(r->res.getCode().equals(r.getPcode())).filter(r->r.permission.equals(PermissionEnum.extend.name())).collect(Collectors.toList());
            if(extendRresources!=null&&extendRresources.size()>0){
                extendRresources.forEach(subResources->{
                    securityMap.put(subResources.getUrl(),groupStr);
                });
            }
        });
        //需要权限的查询接口绑定进来(查询接口所在类里操作接口的权限组添加)
        for(SysResources reqResource:reqResources){
            if(actionTypeGroupMap.get(reqResource.getActionType())!=null){
                securityMap.put(reqResource.getUrl(),StringUtils.join(actionTypeGroupMap.get(reqResource.getActionType()),","));
            }
        }
        return securityMap;
    }

    /**
     * 权限组资源简单模式下获取一个权限组能够访问的资源code
     */
    public List<String> findSimpleGroupResourceCodes(String groupId){
        GroupVo vo=queryOne(GroupVo.class,groupId);
        // 权限组关联的资源
        List<String> codes=vo.getSysGroupResources_sysResources_code();
        //1. 权限能访问到的菜单对应的必选资源一并添加
        if(codes!=null&&vo.getSysGroupResources_sysResources_sysMenuId()!=null){
            List<String> menuIds=vo.getSysGroupResources_sysResources_sysMenuId();
            menuIds.removeIf(item -> item == null);
            //权限组绑定操作接口所在api里的查询类接口查询
            List<String> reqResourcesCodeList=resourcesService.findQueryResources(vo.getResources()).stream().map(SysResources::getCode).collect(Collectors.toList());
            codes.addAll(reqResourcesCodeList);
//            List<String> requireResourcesCodeList=resourcesService.findMenuRequireResources(menuIds.toArray(new String[menuIds.size()]));
//            codes.addAll(requireResourcesCodeList);
        }
        List subs=new ArrayList<>();
        //2. 继承的接口资源 如save->saveXxDto添加
        if(codes!=null){
            for(String code:codes){
                List<String> subCodes=resourcesService.find(QueryWrapper.of(SysResources.class).eq("pcode",code).eq("permission","extend")).stream().map(item -> item.getCode()).collect(Collectors.toList());
                subs.addAll(subCodes);
            }
            codes.addAll(subs);
        }
        return codes;
    }

}
