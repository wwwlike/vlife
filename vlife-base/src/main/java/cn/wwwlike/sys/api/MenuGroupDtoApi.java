package cn.wwwlike.sys.api;

import cn.wwwlike.sys.dto.MenuCrudDto;
import cn.wwwlike.sys.service.SysMenuService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 分组菜单dto接口
 */
@RestController
@RequestMapping("/menuGroupDto")
public class MenuGroupDtoApi extends VLifeApi<MenuCrudDto, SysMenuService> {

}
