package cn.wwwlike.config;

import cn.wwwlike.sys.dto.FormFieldDto;
import cn.wwwlike.sys.entity.ButtonField;
import cn.wwwlike.sys.entity.FormField;
import cn.wwwlike.sys.service.ButtonService;
import cn.wwwlike.sys.service.FormFieldService;
import cn.wwwlike.sys.vo.ButtonVo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;

/**
 * 根据按钮字段配置对post请求数据requestBody数据进行加工处理
 */
@Aspect
@Component
public class ButtonFieldAop {
    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper for JSON processing
    @Autowired
    public ButtonService buttonService;
    @Autowired
    public FormFieldService fieldService;

    /**
     * 按钮触发事件拦截
     * 1. 给自动赋值按钮设置
     * 2. 判断用户是否有权限使用
     */
    @Around("@annotation(org.springframework.web.bind.annotation.PostMapping)")
    public Object checkRefererAndRequestBody(ProceedingJoinPoint joinPoint) throws Throwable {
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        // 检查方法参数是否包含@RequestBody
        boolean hasRequestBody = Arrays.stream(method.getParameters())
                .anyMatch(param -> param.isAnnotationPresent(RequestBody.class));
        if (!hasRequestBody) {
            return joinPoint.proceed(); // 无@RequestBody则放行
        }
        // 获取当前请求对象
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String buttonId = request.getHeader("buttonId");
        Object[] args = joinPoint.getArgs();
        if (buttonId != null && !buttonId.isEmpty()) {
            ButtonVo btn=buttonService.queryOne(ButtonVo.class,buttonId);
            if(btn.fields!=null&&btn.fields.size()>0&&args.length==1&&method.getParameters()[0].isAnnotationPresent(RequestBody.class)){
                Object originalRequestBody = args[0];
                Map<String, Object> modifiedRequestBody = objectMapper.convertValue(originalRequestBody, Map.class);
                for (ButtonField field : btn.fields) {
                    FormField formField=fieldService.findOne(field.getFormFieldId());
                    String fieldName=formField.getFieldName();
                    if("{{null}}".equals(field.getVal())){//置空
                        modifiedRequestBody.put(fieldName,null);
                    }else if("{{currUser}}".equals(field.getVal())){//当前用户
                        modifiedRequestBody.put(fieldName,SecurityConfig.getCurrUser().getId());
                    }else if("{{today}}".equals(field.getVal())){//今天
                        modifiedRequestBody.put(fieldName,new Date());
                    }else{
                        String dataType=formField.getDataType();
                        if(dataType.equals("array")){
                            //自动赋值的为数组数据
                            modifiedRequestBody.put(fieldName, Arrays.asList(field.getVal().split(",")));
                        }else{
                            modifiedRequestBody.put(fieldName, field.getVal());
                        }

                    }
                }
                args[0] = objectMapper.convertValue(modifiedRequestBody, originalRequestBody.getClass());
            }
        }
        return joinPoint.proceed(args); // 继续执行原方法
    }
}