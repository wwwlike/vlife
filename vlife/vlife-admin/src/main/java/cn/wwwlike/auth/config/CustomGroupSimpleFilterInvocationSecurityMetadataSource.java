package cn.wwwlike.auth.config;

import cn.wwwlike.auth.service.SysGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 跳过role方式简单方式的权限配置
 */
@Component
public class CustomGroupSimpleFilterInvocationSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {
    AntPathMatcher antPathMatcher = new AntPathMatcher();
    @Autowired
    public SysGroupService groupService;
    public static Map<String,String> urlGroup;
    private Map<String, List<ConfigAttribute>> cachedAttributes = new ConcurrentHashMap<>();

//    这个类的作用是根据用户传来的请求地址，分析请求需要的角色，并将所需要的角色放在 Collection中
    @Override
    public Collection<ConfigAttribute> getAttributes(Object o) throws IllegalArgumentException {
        String requestUrl = ((FilterInvocation) o).getRequestUrl();
        if(urlGroup==null){
            urlGroup=groupService.securityMap();
            cachedAttributes= new ConcurrentHashMap<>();
        }
        List<ConfigAttribute> attributes = cachedAttributes.get(requestUrl);
        if(attributes == null){
            attributes = new ArrayList<>();
            for (String url : urlGroup.keySet()) {
                if(antPathMatcher.match(url, requestUrl)){
                    attributes.add(new SecurityConfig(urlGroup.get(url)));
                }
            }
            cachedAttributes.put(requestUrl, attributes);
        }
        return attributes;
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return false;
    }

}