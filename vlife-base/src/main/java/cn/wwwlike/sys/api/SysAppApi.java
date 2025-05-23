package cn.wwwlike.sys.api;
import cn.wwwlike.sys.entity.SysApp;
import cn.wwwlike.sys.service.SysAppService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 应用
 */
@RestController
@RequestMapping("/sysApp")
public class SysAppApi extends VLifeApi<SysApp, SysAppService> {

    @VMethod(permission = PermissionEnum.noAuth)
    @PostMapping("/list")
    @Override
    public <Q extends VlifeQuery> List<SysApp> list(@RequestBody Q req) {
        return super.list(req);
    }
}
