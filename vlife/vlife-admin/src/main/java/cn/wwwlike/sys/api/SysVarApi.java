package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysVar;
import cn.wwwlike.sys.service.SysVarService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

/**
 * 系统变量设置
 */
@RestController
@RequestMapping("/sysVar")
public class SysVarApi extends VLifeApi<SysVar, SysVarService> {
    //查询
    @PostMapping("/page")
    public PageVo<SysVar> page(@RequestBody PageQuery<SysVar> req) {
        return service.findPage(req);
    }


    //查询
    @PostMapping("/list")
    public List<SysVar> list(@RequestBody PageQuery<SysVar> req) {
        return service.find(req);
    }

    //配置信息保存
    @PostMapping("/save")
    public SysVar save(@RequestBody SysVar dto) {
        return service.save(dto);
    }


    //系统变量设置
    @PostMapping("/save/vals")
    public SysVar[] saveVals(@RequestBody SysVar[] vars) {
        Arrays.asList(vars).forEach(var->{
            service.saveWithAssign(var,"val");
        });
        return vars;
    }

    //删除
    @DeleteMapping("/remove")
    public Long remove(@RequestBody String[] ids) {
        return service.remove(ids);
    }

}
