package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 菜单资源绑定
 */
@Data
public class MenuResourcesDto implements SaveBean<SysMenu> {
    public String id;
    //关联资源
    public List<String> sysResources_id;
}
