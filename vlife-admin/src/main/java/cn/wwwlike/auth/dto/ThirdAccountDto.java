package cn.wwwlike.auth.dto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.base.model.IModel;
import lombok.Data;

/**
 * 第三方账号信息
 */
@Data
public class ThirdAccountDto implements IModel<SysUser> {
    String from;//来源
    String username;// 账号
    String id; //三方账号id
    String email;// 邮箱
    String thirdToken; //三方账号临时token
    String name;// 中文
    String token;//本系统token
    String avatar;//头像
}
