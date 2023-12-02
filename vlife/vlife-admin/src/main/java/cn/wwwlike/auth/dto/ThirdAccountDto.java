package cn.wwwlike.auth.dto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.vlife.base.IModel;
import lombok.Data;

/**
 * 第三方账号信息
 */
@Data
public class ThirdAccountDto implements IModel<SysUser> {
    public String from;//来源
    public String username;// 账号
    public String id; //三方账号id
    public String email;// 邮箱
    public String thirdToken; //三方账号临时token
    public String name;// 中文
    public String token;//本系统token
    public String avatar;//头像
}
