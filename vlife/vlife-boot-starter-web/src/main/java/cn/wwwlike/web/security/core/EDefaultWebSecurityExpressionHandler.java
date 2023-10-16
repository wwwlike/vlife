package cn.wwwlike.web.security.core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
//权限校验处理器

public class EDefaultWebSecurityExpressionHandler extends DefaultWebSecurityExpressionHandler {

    @Autowired
    PermissionEvaluator permissionEvaluator;

    @Override
    protected PermissionEvaluator getPermissionEvaluator() {
        return permissionEvaluator;
    }
    
    


}
