package cn.wwwlike.web.security.filter;

import cn.wwwlike.vlife.bean.Result;
import cn.wwwlike.web.security.core.SecurityUser;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;

import javax.security.sasl.AuthenticationException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Date;

//拦截url为 "/login" 的POST请求
public class MyUsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    public String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    public MyUsernamePasswordAuthenticationFilter(String urlMapping, AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher(urlMapping));
        setAuthenticationManager(authenticationManager);//设置用户信息管理的对象
    }
    private TokenUtil tokenUtil;

    /**
     * postman body->raw->json 这种方式请求
     * 从json中获取username和password
     * @param request
     * @param response
     * @return
     * @throws AuthenticationException
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException, ServletException {
        String body = StreamUtils.copyToString(request.getInputStream(), Charset.forName("UTF-8"));
        String username = null, password = null;
        if(StringUtils.hasText(body)) {
            JSONObject jsonObj = JSON.parseObject(body);
            username = jsonObj.getString("username");
            password = jsonObj.getString("password");
        }
        if (username==null||"".equals(username)) {
            username = request.getParameter("username");
        }
        if (password==null||"".equals(password)) {
            password = request.getParameter("password");
        }

        if (username == null)
            username = "";
        if (password == null)
            password = "";
        username = username.trim();
        password = password.trim();
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
                username, password);
        logger.info(" IP:"+getIpAddress(request)+" Login at："+DateFormatUtils.format(new Date(),"yyyy-MM-dd HH:mm:ss"));
        return this.getAuthenticationManager().authenticate(authRequest);
    }


    //认证成功处理器
    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res,
                                            FilterChain chain, Authentication authToken) throws IOException, ServletException {
        SecurityContextHolder.getContext().setAuthentication(authToken);
        SecurityUser SecurityUser = (SecurityUser) authToken.getPrincipal();
        String tokenString = this.tokenUtil.createTokenForUser(SecurityUser);
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json; charset=utf-8");
        res.getWriter().print(JSON.toJSON(Result.createSuccess(tokenString)));
        res.getWriter().flush();
        res.getWriter().close();
    }

    //无token; 用户名或者密码错误 会进入此方法
    //token超期，无权限，token不正确，不会进入此方法
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException failed) throws IOException, ServletException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.getWriter().write(JSON.toJSONString(Result.createFail(300,"用户名或者密码错误")));
    }
}