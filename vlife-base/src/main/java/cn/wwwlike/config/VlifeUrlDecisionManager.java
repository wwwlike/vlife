package cn.wwwlike.config;

import cn.wwwlike.web.security.core.SecurityUser;
import cn.wwwlike.web.security.core.UserAuthentication;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Collection;

/**
 * 鉴权
 */
@Component
public class VlifeUrlDecisionManager implements AccessDecisionManager {
    @Override
    public void decide(Authentication authentication, Object object, Collection<ConfigAttribute> configAttributes) throws AccessDeniedException, InsufficientAuthenticationException {
        if(authentication==null||!(authentication instanceof UserAuthentication)){  //没登录访问到授权页面
            throw new AccessDeniedException("Access Denied");
        }
        SecurityUser user=(SecurityUser)authentication.getDetails();
        if(Boolean.TRUE.equals(user.getSuperUser())){
            return ;
        }
        for(ConfigAttribute configAttribute:configAttributes){
            if((user.getGroupIds()!=null&&user.getGroupIds().contains(configAttribute.getAttribute()))||
                   configAttribute.getAttribute().equals(user.getId())||
                    configAttribute.getAttribute().equals(user.getDeptId())
            ){
                return ;
            }
        }
        throw new AccessDeniedException("Access Denied");
    }
    @Override
    public boolean supports(ConfigAttribute attribute) {
        return true;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }
}