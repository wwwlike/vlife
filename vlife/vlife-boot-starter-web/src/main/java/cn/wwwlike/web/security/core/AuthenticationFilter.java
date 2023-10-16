package cn.wwwlike.web.security.core;

import com.alibaba.fastjson.JSON;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

/**
 * 自定义认证过滤器，判断认证成功还是失败，并给予相对应的逻辑处理
 */
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    AuthenticationManager authenticationManager;

    public AuthenticationFilter(AuthenticationManager authenticationManager){
        this.authenticationManager=authenticationManager;
    }

    //未认证时调用此方法，判断认证是否成功，认证成功与否由authenticationManager.authenticate()去判断，我们在这里只负责传递所需要的参数即可
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username=request.getParameter("username");
        String password=request.getParameter("password");
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password,new ArrayList<>()));
    }

    //验证成功操作
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        /**
         * 验证成功则向redis缓存写入token，然后在响应头添加token，并向前端返回
         */
        String token= UUID.randomUUID().toString().replaceAll("-","");  //token本质就是随机生成的字符串
        response.setHeader("token",token);  //在响应头添加token
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.getWriter().write(JSON.toJSONString(""));
    }

    //验证失败
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        /**
         * 验证成功则向前端返回失败原因
         */
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.getWriter().write(JSON.toJSONString("error"));
    }
}