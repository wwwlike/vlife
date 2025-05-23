package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysNews;
import cn.wwwlike.sys.service.SysNewsService;

import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 通知公告接口
 */
@RestController
@RequestMapping("/sysNews")
public class SysNewsApi extends VLifeApi<SysNews, SysNewsService> {

}
