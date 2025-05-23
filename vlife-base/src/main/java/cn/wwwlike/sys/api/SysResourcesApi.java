package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysApp;
import cn.wwwlike.sys.entity.SysMenu;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysMenuService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 权限资源接口
 */
@RestController
@RequestMapping("/sysResources")
public class SysResourcesApi extends VLifeApi<SysResources, SysResourcesService> {
    @Autowired
    public SysMenuService menuService;
    @Autowired
    public FormService formService;

    @VMethod(permission = PermissionEnum.noAuth)
    @PostMapping("/list")
    @Override
    public <Q extends VlifeQuery> List<SysResources> list(@RequestBody Q req) {
        return super.list(req);
    }

    /**
     * 写入类接口查询
     */
    @PostMapping("/listButtons")
    public List<SysResources> listButtons(@RequestBody VlifeQuery<SysResources> req) {
        List<SysResources> buttonResources= service.find(req);
        return service.buttonFilter(buttonResources);
    }
}
