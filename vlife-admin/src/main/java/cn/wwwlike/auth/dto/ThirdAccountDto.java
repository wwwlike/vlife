package cn.wwwlike.auth.dto;

import lombok.Data;

/**
 * 第三方账号信息
 */
@Data
public class ThirdAccountDto {
    String from;
    String username;
    String id;
    String email;
    String thirdToken;
    String name;
    String token;
    String avatar;//头像
}
