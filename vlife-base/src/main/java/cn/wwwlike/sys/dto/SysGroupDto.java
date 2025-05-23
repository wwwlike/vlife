package cn.wwwlike.sys.dto;
import cn.wwwlike.sys.entity.SysGroup;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 角色组用户配置
 */
@Data
public class SysGroupDto extends SaveBean<SysGroup> {
    public List<String> sysUserGroup_sysUserId;
}
