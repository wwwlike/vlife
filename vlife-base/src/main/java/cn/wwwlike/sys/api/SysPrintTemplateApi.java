package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysPrintTemplate;
import cn.wwwlike.sys.service.SysPrintTemplateService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 打印模版接口
 */
@RestController
@RequestMapping("/sysPrintTemplate")
public class SysPrintTemplateApi extends VLifeApi<SysPrintTemplate, SysPrintTemplateService> {

}
