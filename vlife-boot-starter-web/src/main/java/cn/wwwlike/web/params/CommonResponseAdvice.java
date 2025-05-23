/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package cn.wwwlike.web.params;

import cn.wwwlike.web.exception.pojo.ErrorResponse;
import cn.wwwlike.web.params.bean.NativeResult;
import cn.wwwlike.web.params.bean.Result;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.awt.image.BufferedImage;
import java.util.Objects;

/**
 * 数据返回封装
 * 实现统一的接口返回类型
 * 控制层拦截器 负责所有数据的返回封装
 * 无法拦截过滤器
 */
@RestControllerAdvice
public class CommonResponseAdvice implements ResponseBodyAdvice {
    @Override
    public boolean supports(MethodParameter methodParameter, Class aClass) {
        return filter(methodParameter);
    }
    /**
     * 根据返回类型来判断是否需要进行后续操作
     *
     * @param methodParameter
     * @return
     */
    private boolean filter(MethodParameter methodParameter) {
        return true;
    }
    /**
     * @param returnValue 返回值
     */
    @Override
    public Object beforeBodyWrite(Object returnValue, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        Result result;
        //获取返回值类型
        String returnClassType = returnType.getParameterType().getSimpleName();
        //错误或者有异常直接到前台，无需再次封装
        if (ErrorResponse.class.isAssignableFrom(returnType.getParameterType())) {
            return returnValue;
        }
        //如果返回值类型为void，则默认返回成功
        if ("void".equals(returnClassType)) {
            result = Result.createSuccess();
        } else if ("Result".equals(returnClassType)) {
            result = (Result) returnValue;
        } else if ("String".equals(returnClassType)) {
            result = Result.createSuccess(returnValue);
//            ObjectMapper objectMapper = new ObjectMapper();
//            return objectMapper.writeValueAsString(request);
//            return new Gson().toJson(request);
//           return JSON.toJSONString(result);
        } else if ("ResponseEntity".equals(returnClassType)) {
            return returnValue;
        } else if (returnValue != null && NativeResult.class == returnValue.getClass()) {
            return ((NativeResult) returnValue).getRs();
        } else if (returnValue != null && (BufferedImage.class == returnValue.getClass()||returnValue.getClass()==byte[].class)) {
            return returnValue;//图片流直接返回
        } else {
            if (Objects.isNull(returnValue)) {
                result = Result.createSuccess();
            } else {
                result = Result.createSuccess(returnValue);
            }
        }
        return result;
    }
}