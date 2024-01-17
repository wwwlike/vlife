package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 权限导入
 * 完成菜单资源绑定操作，并能设置主要接口
 */
@Data
public class MenuResourcesDto implements SaveBean<SysMenu> {
    //菜单id
    public String id;
    //表单id
    public String formId;
    //关联资源
    public List<String> sysResources_id;
    /**
     * 主要接口
     * 从关联接口里选择
     */
    @VField(skip = true)
    public List<String> requireIds;
}
