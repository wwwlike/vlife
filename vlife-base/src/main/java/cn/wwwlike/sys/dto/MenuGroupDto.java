package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysMenu;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * 应用菜单分组
 * 一级菜单
 */
@Data
public class MenuGroupDto  extends SaveBean<SysMenu> implements ITree {
    public String sysAppId;
    /**
     * 分组名称
     */
    public String name;
    public String pcode;
    public String code;
    public String icon;
    public Integer sort;
}
