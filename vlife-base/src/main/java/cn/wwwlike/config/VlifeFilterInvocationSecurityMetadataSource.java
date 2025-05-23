package cn.wwwlike.config;

import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysGroupService;
import cn.wwwlike.sys.service.SysMenuService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.sys.service.SysTabButtonService;
import cn.wwwlike.sys.vo.SysResourcesVo;
import cn.wwwlike.vlife.dict.CT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 根据请求的 URL 动态地提供安全权限信息，确保用户在访问特定资源时具有相应的权限。
 * 通过缓存机制，它提高了性能，避免了重复的权限查询操作
 */
@Component
public class VlifeFilterInvocationSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {
    AntPathMatcher antPathMatcher = new AntPathMatcher();
    @Autowired
    public SysMenuService menuService;
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysTabButtonService tabButtonService;
    //权限接口url与访问者对应关系
    public static Map<String, Set<String>> urlVisits;
    private Map<String, List<ConfigAttribute>> cachedAttributes = new ConcurrentHashMap<>();//存储请求 URL 和对应权限组的缓存

    public static final Set<String> PUBLIC_URLS;
    static {
        Set<String> urls = new HashSet<>();
        urls.add("/dist/**");
        urls.add("/open/api/getToken");
        urls.add("/tsCode/code/*");
        urls.add("/sysUser/sendEmail");
        urls.add("/sysVar/list");
        urls.add("/git/*");
        urls.add("/git/token/*");
        urls.add("/index.html");
        urls.add("/assets/**");
        urls.add("/*.js");
        urls.add("/*.css");
        urls.add("/*.ico");
        urls.add("/static/**");
        urls.add("/ts/test/file");
        urls.add("/ts/upload");
        urls.add("/sysFile/uploadImg");
        urls.add("/sysFile/image/*");
        urls.add("/sysFile/pdf/*");
        urls.add("/ts/download");
        urls.add("/static/index.html");
        PUBLIC_URLS = Collections.unmodifiableSet(urls);
    }

    /**
     * 给剩余的非主动noauth接口授权超级管理员
     * 给一个并不存在的xxxx,后面只会给superUser开口子
     */
    public void assignSuperExcludingSysReq(){
        if(urlVisits!=null){
            List<SysResourcesVo> resources=resourcesService.queryAll(SysResourcesVo.class).stream()
                    .filter(f->urlVisits.get(f.getUrl())==null) //排除1 已授权的接口
                    .filter(f->!CT.RESOURCES_PERMISSION.NOAUTH.equals(f.getPermission())) //排除2：注解为无需授权接口排除
//                    .filter(f->(f.form_sysApp_appKey!=null))
//                    .filter(f->{
//                        return !(f.form_sysApp_appKey.equals("sys")&&f.getParamType().equals("req"));
//                    }) //排除3: 系统管理查询接口排除
                    .collect(Collectors.toList());
            for(SysResourcesVo resource:resources){
                Set<String> set=new HashSet<>();
                set.add("xxxx"); //运维人员可以对没有添加进来的接口拥有权限
                urlVisits.put(resource.getUrl(),set);
            }
        }
    }
    /**
     * 根据用户传来的请求地址，分析url对应的权限组
     */
    @Override
    public Collection<ConfigAttribute> getAttributes(Object o) throws IllegalArgumentException {
        String requestUrl = ((FilterInvocation) o).getRequestUrl();
        // 检查 URL 是否是公共的
        for (String publicUrl : PUBLIC_URLS) {
            if (antPathMatcher.match(publicUrl, requestUrl)) {
                return Collections.emptyList(); //跳过
            }
        }

        if(urlVisits==null){
            urlVisits=new HashMap<>();
            //1. 根据视图页签绑定角色与资源的关系确定进行拦截url与角色组
            urlVisits.putAll(tabButtonService.curdMenuTabButtonVisits());
            //2. 添加curd页面查询权限(xxx/page接口)的映射授权信息(拥有操作权限就拥有了查询权限)
            //已屏蔽 查询类的接口在查询时候根据page|tabId权限判断，是否满足； 没有tabId的场景就是 RealationInput组件
            //urlVisits.putAll(menuService.curdMenuPageApiVisits());
            //3. 过滤以下部分接口让super可以访问(sys操作接口以及所有业务应用接口)；剩余接口有token即可访问(sys查询接口)
            assignSuperExcludingSysReq();
           cachedAttributes= new ConcurrentHashMap<>(); //security的缓存结构

        }
        List<ConfigAttribute> attributes = cachedAttributes.get(requestUrl);
        if(attributes == null){
            attributes = new ArrayList<>();
            for (String url : urlVisits.keySet()) {
                if(antPathMatcher.match(url, requestUrl)){ //查询当前访问的url是否在权限接口url集合中
                    for(String visitId:urlVisits.get(url)){
                        attributes.add(new SecurityConfig(visitId));
                    }
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