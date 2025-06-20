package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysMenu;
import cn.wwwlike.sys.entity.SysTab;
import cn.wwwlike.sys.entity.SysTabButton;
import cn.wwwlike.sys.entity.SysTabVisit;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 视图数据
 */
@Data
public class SysTabDto extends SaveBean<SysTab> {
    public String title;
    public String sysMenuId;
    public String icon;
    public String viewType;
    public String formId;
    public Integer sort;
    public String dataLevel;
    public String orderType;
    public String orderFieldName;
    public String orderDirection;
    public String formShowType;
    public String fieldNames;
    public String conditionJson;
    public List<SysTabButton> sysTabButtons;//视图绑定的按钮
    public List<SysTabVisit> sysTabVisits; //视图绑定的授权对象
}
