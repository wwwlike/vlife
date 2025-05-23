package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * 密码修改dto
 */
@Data
public class UserPasswordModifyDto extends SaveBean<SysUser> {
    /**
     * 原密码
     */
    public String password;
    /**
     * 新密码
     */
    @VField(skip = true)
    public String newPassword;
}
