

package cn.wwwlike;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * 自定义拦截器类
 */
@Configuration
public class MyInterceptor implements HandlerInterceptor {// 实现HandlerInterceptor接口
	/**
	 * 访问控制器方法前执行
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		System.out.println(new Date() + "--preHandle:" + request.getRequestURL());
		return true;
	}

	/**
	 * 访问控制器方法后执行
	 */
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		System.out.println(new Date() + "--postHandle:" + request.getRequestURL());
	}

	/**
	 * postHandle方法执行完成后执行，一般用于释放资源
	 */
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println(new Date() + "--afterCompletion:" + request.getRequestURL());
	}
}
