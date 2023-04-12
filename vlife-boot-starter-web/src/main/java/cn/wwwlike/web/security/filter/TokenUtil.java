package cn.wwwlike.web.security.filter;

import cn.wwwlike.web.security.core.SecurityUser;
import cn.wwwlike.web.security.core.UserAuthentication;
import com.alibaba.fastjson.JSON;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Optional;

/**
 * 生成token 解析token 取到token
 */
public class TokenUtil {
    private final static Logger logger = LoggerFactory.getLogger(TokenUtil.class);
    /**
     * TODO long类型数值范围，超限达到不到想要的效果  长久不失效
     */
    private static final long THIRD_VALIDITY_TIME_MS = 2 * 60 * 60 * 1000;//2hours

    private static final long VALIDITY_TIME_MS = 24 * 60 * 60 * 1000; //24hours

    private static final String AUTH_HEADER_NAME = "Authorization";

    private static String secret = "mrin";

    public static Optional<Authentication> verifyToken(HttpServletRequest request) {
        final String token;
        if (request.getHeader(AUTH_HEADER_NAME) == null) {
            token = request.getParameter("token");
        } else {
            token = request.getHeader(AUTH_HEADER_NAME);
        }
        if (token != null && !token.isEmpty()) {
            return Optional.of(new UserAuthentication(parseUserFromToken(token), token));
        }
        return Optional.empty();

    }
    /**
     * 根据token取到用户信息
     * @param token
     * @return
     */
    public static SecurityUser parseUserFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(secret)
                .parseClaimsJws(token).getBody();
        SecurityUser tokenUser = JSON.parseObject(JSON.toJSONString(claims.get("user")), SecurityUser.class);
//        JSON.toJSONString(claims.get("user")).
//        SecurityUser tokenUser = new SecurityUser(,null,null,
//               null
//               );
        return tokenUser;
    }

    /**
     * 根据验证通过的用户信息创建token
     * @param user
     * @return
     */
    public static String createTokenForUser(SecurityUser user) {
        return createTokenForUser(user, new Date(System.currentTimeMillis() + VALIDITY_TIME_MS));
    }
    /**
     * 根据验证通过的用户信息创建token
     * @param user
     * @return
     */
    public static String createTokenForUser(SecurityUser user, Date exp) {
        // 根据用户信息生成token
        return Jwts
                .builder()
                .setExpiration(exp)
                // 过期时间
                .setSubject(user.getId())
                .claim("user", user)
//                .claim("unit",user.getUnit())
                // 用户所在单位
                // 用户所在行政区划
//                .claim("authorities", user.getAuthorities())
                .signWith(SignatureAlgorithm.HS256, secret).compact();
    }
}
