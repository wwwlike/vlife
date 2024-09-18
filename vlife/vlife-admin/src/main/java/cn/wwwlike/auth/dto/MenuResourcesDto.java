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
    //菜单
    public String id;
    //数据集
    public String formId;
    //导入权限
    public List<String> sysResources_id;
//    /**
//     * 主要接口
//     * 从关联接口里选择(待去除)
//     */
//    @VField(skip = true)
//    public List<String> requireIds;
}
