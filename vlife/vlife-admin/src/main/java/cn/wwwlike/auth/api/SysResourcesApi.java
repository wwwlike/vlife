package cn.wwwlike.auth.api;
import cn.wwwlike.auth.dto.ResourcesStateDto;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.req.SysResourcesPageReq;
import cn.wwwlike.auth.service.SysMenuService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.base.PageableRequest;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
     */
    @PostMapping("/list")
    public List<SysResources> list(@RequestBody PageQuery req) {
       return service.find(req);
    }
    /**
     * 按钮可绑定资源
     */
    @PostMapping("/listButtons")
    public List<SysResources> listButtons(@RequestBody PageQuery req) {
        List<SysResources> buttonResources= service.find(req);
        return service.buttonFilter(buttonResources);
    }

    /**
     * 资源删除
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }
}
