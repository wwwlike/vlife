package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.base.model.IModel;
import lombok.Data;

/**
 * 注册信息
 * SysUser 归类
 */
@Data
public class RegisterDto implements IModel<SysUser> {
    /**
     * 邮箱账号
     */
    public String email;
    /**
     * 密码
     */
    public String password;
    /**
     * 校验码
     */
    public String checkCode; 
}
