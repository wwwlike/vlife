package cn.wwwlike.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.resource.PathResourceResolver;
import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {
//    @Autowired
//    private CustomInterceptor customInterceptor;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource resource = location.createRelative(resourcePath);
                        // 如果资源存在且可读，则返回，否则返回index.html
                        return resource.exists() && resource.isReadable() ? resource
                                : location.createRelative("index.html");
                    }
                });
    }

//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        // 拦截所有请求（"/**" 表示所有路径）
//        registry.addInterceptor(customInterceptor)
//                .addPathPatterns("/**") // 匹配所有路径
//                .excludePathPatterns("/login"); // 排除特定路径（可选）
//    }
}