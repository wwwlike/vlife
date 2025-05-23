package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 用户信息
 */
@Data
public class SysUserDto extends SaveBean<SysUser> {
    public String username;
    public String name;
    public String sysDeptId;
    public String email;
    public String tel;
    public String idno;
    public String avatar;
    public String state;
    public String password;
    public Boolean superUser;
    public List<String> sysUserGroup_sysGroupId;
}
