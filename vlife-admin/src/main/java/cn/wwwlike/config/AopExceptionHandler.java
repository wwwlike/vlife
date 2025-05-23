package cn.wwwlike.config;

import org.springframework.http.HttpStatus;  
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * 无权限访问拦截
 *  security仅判断用户能否访问这个接口，这里是判断有接口权限但是有没有特点场景下的权限
 * 查询接口请求无权限（tab无视图访问查询权限）
 * 操作接口请求无权限 (btnId无权限调用)
 */
@ControllerAdvice  
public class AopExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex) {  
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());  
    }  
}  