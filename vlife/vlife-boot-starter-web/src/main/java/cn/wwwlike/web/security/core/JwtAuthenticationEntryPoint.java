package cn.wwwlike.web.security.core;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//是否有权限
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException{
    }

//
//    @Override
//    public void commence(HttpServletRequest request,
//                         HttpServletResponse response,
//                         AuthenticationException authException) throws IOException {
//   	ResponseHandler.response401(response, new OperationResponse(ResponseStatusEnum.NO_ACCESS, authException.getMessage()));
//   	ResponseHandler.reseponseI18n(request,response,authException.getMessage().replaceAll(" ","_"));//可以考虑不要写死
//   	ResponseHandler.fail(response,Rre.UN_AUTH);//没有登录不能访问
//    }
}
