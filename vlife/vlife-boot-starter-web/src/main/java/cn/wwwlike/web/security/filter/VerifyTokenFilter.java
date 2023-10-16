package cn.wwwlike.web.security.filter;


import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import cn.wwwlike.web.exception.pojo.ErrorResponse;
import com.alibaba.fastjson.JSON;
import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

/**
 * token过滤器
 */
public class VerifyTokenFilter extends GenericFilterBean {

    private final static Logger logger = LoggerFactory.getLogger(VerifyTokenFilter.class);
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        try {
            Optional<Authentication> authentication = TokenUtil.verifyToken(request);
            if (authentication.isPresent()) {
                SecurityContextHolder.getContext().setAuthentication(authentication.get());
                //SecurityContextHolder是用来保存SecurityContext的。SecurityContext中含有当前正在访问系统的用户的详细信息
            } else {
                //没有登录信息
                SecurityContextHolder.getContext().setAuthentication(null);
            }
            filterChain.doFilter(req, res);  //去下一个过滤器
//        } catch (ExpiredJwtException e) { //过期
//        } catch (IllegalArgumentException e) {
//        } catch (AccessDeniedException e) {
//        } catch (BadCredentialsException e) {
        }catch(ExpiredJwtException jwtException){
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.getWriter().write(JSON.toJSONString(
                    new ErrorResponse(CommonResponseEnum.TOKEN_EXPIRED.getCode(),CommonResponseEnum.TOKEN_EXPIRED.getMessage())
            ));
        } catch (Exception e) {
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.getWriter().write(JSON.toJSONString(
                    new ErrorResponse(CommonResponseEnum.SERVER_ERROR.getCode(), e.toString()+"发生在:"+e.getStackTrace()[0].toString())
            ));
//            ResponseHandler.fail(response, Rre.find(e), e.getMessage());
//            e.printStackTrace();
        } finally {
//            SecurityContextHolder.getContext().setAuthentication(null);
            return;
        }
    }


}
