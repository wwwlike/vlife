package cn.wwwlike.sys.api;
import cn.wwwlike.sys.entity.SysGroup;
import cn.wwwlike.sys.service.SysGroupService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.*;
/**
 * 权限组接口
 */
@RestController
@RequestMapping("/sysGroup")
public class SysGroupApi extends VLifeApi<SysGroup, SysGroupService> {
}
