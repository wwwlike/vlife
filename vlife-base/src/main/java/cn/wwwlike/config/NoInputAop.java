package cn.wwwlike.config;

import cn.wwwlike.sys.service.FormNoService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * 自动编号拦截器
 */
@Aspect
@Component
public class NoInputAop {
    @Autowired
    FormNoService formNoService;

    @Around("execution(public * *(.., @org.springframework.web.bind.annotation.RequestBody (*), ..)) && args(requestBody, ..)")
    public Object interceptCreateRequest(ProceedingJoinPoint pjp, Object requestBody) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String requestURI = request.getRequestURI();
        // 检查请求路径
        if (requestURI.endsWith("create") && "POST".equalsIgnoreCase(request.getMethod())) {
            Object transformedRequestBody = transformRequestData(requestBody);
            // 执行原始请求
            Object response = pjp.proceed(new Object[]{transformedRequestBody});
            // 返回响应
            return response;
        }

        // 不满足条件的请求，直接执行原始方法
        return pjp.proceed();
    }

    private Object transformRequestData(Object requestBody) {
        Field[] fields = requestBody.getClass().getDeclaredFields();
        for (Field field : fields) {
            // 如果字段是字符串类型，则进行处理
            if (field.getType().equals(String.class)) {
                field.setAccessible(true); // 允许访问私有字段
                try {
                    String value = (String) field.get(requestBody);
                    if (value != null && value.startsWith("SN{") && value.endsWith("}")) {
                        // 提取中间的数据，即去掉 "SN{" 和 "}"
                        String extractedData = value.substring(3, value.length() - 1);
                        field.set(requestBody,  formNoService.getNo(extractedData,true));
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace(); // 处理异常
                }
            }
        }
        return requestBody;
    }
}
