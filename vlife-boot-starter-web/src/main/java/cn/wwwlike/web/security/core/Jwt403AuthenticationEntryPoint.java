package cn.wwwlike.web.security.core;

import cn.wwwlike.vlife.base.bean.Result;
import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Jwt403AuthenticationEntryPoint extends Http403ForbiddenEntryPoint {

	private final static Logger logger = LoggerFactory.getLogger(Jwt403AuthenticationEntryPoint.class);

	@Override
	public void commence(HttpServletRequest request,
                         HttpServletResponse response, AuthenticationException arg2)
			throws IOException {

//		ResponseEnum.BAD_LICENCE_TYPE.assertIsTrue(true);
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json; charset=utf-8");
		response.getWriter().write(JSON.toJSONString(Result.createFail(401,arg2.getMessage())));
//        response.getWriter().print(HttpServletResponse.SC_UNAUTHORIZED+arg2.getMessage());
	}

   
}
