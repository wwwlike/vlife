package cn.wwwlike.web.security.core;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 权限校验类
 */
@Configuration
public class EPermissionEvaluator implements PermissionEvaluator {

    public static Map<String, List<String>> resourceRoleMap=new HashMap<>();
    
    @Override
    public boolean hasPermission(Authentication authentication,
            Object targetDomainObject,
            Object permission) {
        return this.hasPermission(authentication, permission);
    }

    @Override
    public boolean hasPermission(Authentication authentication,
            Serializable targetId,
            String targetType,
            Object permission) {
        return true;
    }

    private boolean hasPermission(Authentication authentication, Object permission) {
        if(authentication==null||!(authentication instanceof UserAuthentication)){  //没登录访问到授权页面
            return false;
        }
       SecurityUser user=(SecurityUser)authentication.getDetails();
       if(permission.toString().indexOf(user.getGroupId())!=-1){
           return true;
       }
        return false;
    }

}
