package cn.wwwlike.auth.dto;

import cn.wwwlike.vlife.objship.dto.SaveDto;
import lombok.Data;

/**
 * 注册信息
 */
@Data
public class RegisterDto extends SaveDto {
    public String email;//账号邮箱
    public String password; //密码
    public String checkCode; //校验码
}
