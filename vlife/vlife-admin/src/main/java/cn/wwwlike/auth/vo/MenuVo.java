package cn.wwwlike.auth.vo;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;
import java.util.List;

@Data
@VClazz(orders = "sort_asc")
public class MenuVo implements VoBean<SysMenu> {
    public String id;
    public String name;
    public String code;
    public String pcode;
    public String url;
    public Integer sort;
    public String icon;
    public String entityType;
    public boolean app;
    public String sysRoleId;
    public String formId;
    public String placeholderUrl;
    /**
     * 权限列表
     */
    public List<SysResources> sysResourcesList;
}
