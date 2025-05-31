package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysMenu;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * curd菜单dto
 */
@Data
public class MenuCrudDto  extends SaveBean<SysMenu> implements ITree {
    public String sysAppId;
    public String name;
    public String pcode;
    public String code;
    public String pageType;
    public String icon;
    public String url;
    public String formId;
    public Integer sort;
    public String groupIds;
}
