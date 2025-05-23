package cn.wwwlike.config;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static cn.wwwlike.config.VlifeFilterInvocationSecurityMetadataSource.PUBLIC_URLS;

/**
 * 废弃，
 * 接口二次拦截
 * 1.白名单直接放行
 * 2.业务接口没配置按钮权限不能访问
 * 3.系统操作接口非superUser不能访问
 * 4.系统接口没有CT.RESOURCES_PERMISSION.NOAUTH标志的且不是superUser均不能访问
 */
//@Component
public class ResourcesFilter implements Filter {
    @Autowired
    private FilterInvocationSecurityMetadataSource securityMetadataSource;
    @Autowired
    public SysResourcesService resourcesService;

    public static Map<String,SysResources> urlMap;

    private boolean isAuthenticatedOnly(HttpServletRequest request, HttpServletResponse response,FilterChain chain) {
        // 检查是否已认证（非匿名用户）
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null
                && authentication.isAuthenticated();
        // 如果已认证且不需要 RBAC 权限，则是仅需 Token 的接口
        return isAuthenticated && !isRbacProtected(request,response,chain);
    }

    //判断是否需要 RBAC 权限
    private boolean isRbacProtected(HttpServletRequest request,HttpServletResponse response, FilterChain chain) {
        FilterInvocation filterInvocation = new FilterInvocation(request, response, chain);
        Collection<ConfigAttribute> attributes = securityMetadataSource.getAttributes(filterInvocation);
        return attributes != null && !attributes.isEmpty();
    }

    AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String url=httpRequest.getRequestURI();
        if(urlMap==null){
            urlMap=new HashMap<>();
        }
        boolean white=false;
        //白名单跳过
        for (String publicUrl : PUBLIC_URLS) {
            if (antPathMatcher.match(publicUrl, url)) {
                white=true;
               break;
            }
        }
        if (white==true){
            chain.doFilter(request, response);
        }else{
            boolean isAuthenticatedOnly=isAuthenticatedOnly(httpRequest,httpResponse,chain);
            SecurityUser user= SecurityConfig.getCurrUser();
            //isAuthenticatedOnly->需登录有token无需权限接口  && 用户为普通用户的情况，进行二次权限判断 &&操作类接口(非list和page)
            if(isAuthenticatedOnly==true&& user.getSuperUser()!=true&& !url.endsWith("/page")&&!url.endsWith("/list")){
                SysResources resources= urlMap.get(url);
                if(resources==null){
                    List<SysResources> list=resourcesService.find("url",url);
                    if(list!=null&&list.size()>0){
                        urlMap.put(url,list.get(0));
                    }
                }
                SysResources _urlResources=urlMap.get(url);
                if(_urlResources==null ||!_urlResources.getPermission().equals(CT.RESOURCES_PERMISSION.NOAUTH)){
                    // 接口未定义(sysResources表无)或 接口不是noAuth注解的接口则一般用户不能访问
                    httpResponse.setStatus(403);
                    response.setContentType("application/json;charset=UTF-8");
                    // 构建 JSON 格式的错误信息
                    String errorJson = String.format(
                            "{\"code\": %d, \"message\": \"%s\"}",
                            403,
                            httpRequest.getRequestURI()+"无权限访问"
                    );
                    System.out.println(url+"无权限访问");
                    // 写入响应体
                    response.getWriter().write(errorJson);
                    response.getWriter().flush();
                }
            }
            chain.doFilter(request, response);
        }
    }
}