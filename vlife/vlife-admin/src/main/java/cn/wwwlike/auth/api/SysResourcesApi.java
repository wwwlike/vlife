package cn.wwwlike.auth.api;
import cn.wwwlike.auth.dto.ResourcesStateDto;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.req.SysResourcesPageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 权限资源接口
 */
@RestController
@RequestMapping("/sysResources")
public class SysResourcesApi extends VLifeApi<SysResources, SysResourcesService> {
    @Autowired
    public SysRoleService roleService;
    @Autowired
    public SysMenuService menuService;
    /**
     * 资源查询
     */
    @PostMapping("/page")
    public PageVo<SysResources> page(@RequestBody SysResourcesPageReq req) {
        return service.findPage(req);
    }

    /**
     * 资源保存
     */
    @PostMapping("/save")
    public SysResources save(@RequestBody SysResources dto) {
        return service.save(dto);
    }
    /**
     * 资源详情
     */
    @GetMapping("/detail/{id}")
    public SysResources detail(@PathVariable String id) {
        return service.findOne(id);
    }
    /**
     * 资源列表
     * 可查全量的资源数据和指定菜单的资源以及指定主键的资源
     */
    @GetMapping("/list")
    public List<SysResources> list(String formId,String[] ids,String sysMenuId) {
       return service.find(
               QueryWrapper.of(SysResources.class)
                       .eq(formId!=null,"formId", formId)
                       .eq(sysMenuId!=null,"sysMenuId", formId)
                     .in(ids!=null,"id",ids)
       );
    }
    /**
     * 可用资源
     * 查询指定模块下指定菜单可以绑定的资源
     */
    @GetMapping("/list/menuUseableResources")
    public List<SysResources> listMenuUseableResources(String sysMenuId){
        SysMenu menu=menuService.findOne(sysMenuId);
        return service.menuUseableResources(menu.getFormId(),sysMenuId);
    }
    /**
     * 资源删除
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }
}
