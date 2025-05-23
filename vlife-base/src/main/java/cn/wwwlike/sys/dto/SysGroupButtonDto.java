package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysGroup;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 角色权限绑定
 */
@Data
public class SysGroupButtonDto extends SaveBean<SysGroup> {
    /**
     * 权限组名称
     */
    public String name;
    /**
     * 描述
     */
    public String remark;
    /**
     * 角色关联的按钮信息
     */
    @VField(skip = true)
    public List<String> buttonIds;
}
