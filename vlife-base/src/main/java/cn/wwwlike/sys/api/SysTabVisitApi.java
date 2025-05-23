package cn.wwwlike.sys.api;

import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.sys.entity.SysTab;
import cn.wwwlike.sys.entity.SysTabVisit;
import cn.wwwlike.sys.service.SysTabService;
import cn.wwwlike.sys.service.SysTabVisitService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sysTabVisit")
public class SysTabVisitApi extends VLifeApi<SysTabVisit, SysTabVisitService> {
}
