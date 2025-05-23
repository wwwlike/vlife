package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysMenu;
import cn.wwwlike.sys.service.SysMenuService;
import cn.wwwlike.common.VLifeApi;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * 菜单接口
 */
@RestController
@RequestMapping("/sysMenu")
public class SysMenuApi extends VLifeApi<SysMenu, SysMenuService> {
  /**
   * 批量保存
   */
  @PostMapping("/batchSave")
  public List<SysMenu> batchSave(@RequestBody List<SysMenu> dto){
    dto.forEach(m->{
      service.save(m);
    });
    return dto;
  }
}
