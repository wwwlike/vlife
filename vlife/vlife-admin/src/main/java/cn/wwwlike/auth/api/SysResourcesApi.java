package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.AuthDict;
import cn.wwwlike.auth.dto.ResourcesStateDto;
import cn.wwwlike.auth.req.SysResourcesPageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 权限资源接口;
 */
@RestController
@RequestMapping("/sysResources")
public class SysResourcesApi extends VLifeApi<SysResources, SysResourcesService> {
    @Autowired
    public SysRoleService roleService;

    @Autowired
    public SysMenuService menuService;

    /**
     * 保存权限资源;
     * @param dto 权限资源;
     * @return 权限资源;
     */
    @PostMapping("/save")
    public SysResources save(@RequestBody SysResources dto) {
        return service.save(dto);
    }

    /**
     * 明细查询权限资源;
     * @param id 主键id;
     * @return 权限资源;
     */
    @GetMapping("/detail/{id}")
    public SysResources detail(@PathVariable String id) {
        return service.findOne(id);
    }

    /**
     * 全量的资源数据/指定菜单的资源
     */
    @GetMapping("/list/all")
    public List<SysResources> listAll(String menuCode) {
        if (menuCode == null)
            return service.findAll();
        else
            return service.find(QueryWrapper.of(SysResources.class).eq("menuCode", menuCode));
    }

    /**
     * 资源删除
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }

    /**
     * 资源分页
     */
    @GetMapping("/page")
    public PageVo<SysResources> page(SysResourcesPageReq req) {
        return service.findPage(req);
    }

//    /**
//     * 获得待导入的所有接口和菜单的信息
//     */
//    @GetMapping("/page/import")
//    public PageVo<SysResources> pageImport(SysResourcesPageReq req) throws IOException {
//        PageVo<SysResources> page = new PageVo<>();
//        List list = service.imports( req.getSearch());
//        //手工分页
//        int pageSize = req.getPager().getSize();
//        page.setTotal(Long.parseLong(list.size() + ""));
//        page.setSize(pageSize);
//        page.setTotalPage((page.getTotal() / pageSize + new Long(page.getTotal() % pageSize == 0 ? 0 : 1)));
//        page.setResult(list.subList((req.getPager().getPage() - 1) * pageSize,
//                req.getPager().getPage() * pageSize > page.getTotal() ? Integer.parseInt(page.getTotal() + "") : req.getPager().getPage() * pageSize));
//        page.setPage(req.getPager().getPage());
//        return page;
//    }

//    /**
//     * 单个模块的所有接口&菜单（数据库+title结合)
//     */
//    @GetMapping("/menuResources/{menuCode}")
//    public List<SysResources> menuResources(@PathVariable String menuCode) throws IOException {
//        //数据库
//       List<SysResources> rs= service.find("code",menuCode);
//       List list = service.imports(menuCode);
//       if(rs!=null&&rs.size()>0){
//           rs.addAll(service.find("code",menuCode));
//           rs.addAll(list);
//           return rs;
//       }
//       return list;
//    }

//    /**
//     * 数据导入
//     */
//    @PostMapping("/save/import")
//    public SysResources saveImport(@RequestBody SysResources dto) throws IOException {
//        List<SysResources> list = service.imports( dto.getCode());
//        SysResources data = list.stream().filter(l -> l.getCode().equals(dto.getCode())).findFirst().get();
//        data.setId(null);
//        return service.save(data);
//    }

    /**
     * 一次批量保存资源
     */
    @VMethod(expire = true)
    @PostMapping("/save/resources")
    public Integer saveResources(@RequestBody List<SysResources> resources) {
        for(SysResources bean:resources){
            service.save(bean);
            //菜单绑定了资源则需要清空与角色的绑定(清除菜单的角色id)
            Set<String> clearRoleMenuId=resources.stream().filter(r->r.getSysMenuId()!=null).map(SysResources::getSysMenuId).collect(Collectors.toSet());
            menuService.clearRoleId( clearRoleMenuId.toArray(new String[clearRoleMenuId.size()]));
        }
        return  resources.size();
    }


    /**
     * 批量启用
     * 接口资源批量启用(启用后可以纳入到权限管理)
     * @param resourcesStateDto
     * @return
     */
    @PostMapping("/save/resourcesStateDto")
    public ResourcesStateDto saveResourcesStateDto(@RequestBody ResourcesStateDto resourcesStateDto) {
        service.batchStateUseState(resourcesStateDto.getResourcesIds());
        return resourcesStateDto;
    }
}
