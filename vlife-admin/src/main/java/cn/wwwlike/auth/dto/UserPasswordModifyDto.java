package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * 密码修改dto
 */
@Data
public class UserPasswordModifyDto implements SaveBean<SysUser> {
    public String id;
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
