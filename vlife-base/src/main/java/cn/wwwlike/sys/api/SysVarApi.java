package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysVar;
import cn.wwwlike.sys.service.SysVarService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;

/**
 * 系统变量设置接口
 */
@RestController
@RequestMapping("/sysVar")
public class SysVarApi extends VLifeApi<SysVar, SysVarService> {
    /**
     * 批量保存
     */
    @PostMapping("/save/vars")
    public SysVar[] saveVars(@RequestBody SysVar[] vars) {
        Arrays.asList(vars).forEach(var->{
            service.saveWithAssign(var,"val");
        });
        return vars;
    }
}
