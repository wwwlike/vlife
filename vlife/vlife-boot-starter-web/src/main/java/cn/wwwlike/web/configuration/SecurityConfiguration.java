//package cn.wwwlike.web.configuration;
//
//import cn.wwwlike.web.security.core.*;
//import cn.wwwlike.web.security.filter.MyUsernamePasswordAuthenticationFilter;
//import cn.wwwlike.web.security.filter.VerifyTokenFilter;
//import com.blue.sys.entity.SysGroup;
//import com.blue.sys.service.ResourcesService;
//import com.blue.sys.service.UserService;
//import com.blue.sys.vo.PermissionVo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.access.PermissionEvaluator;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
//import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.access.channel.ChannelProcessingFilter;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Configuration
//@EnableWebSecurity
//@ConditionalOnExpression("${security.basic.enable:true}")
//public class SecurityConfigration extends WebSecurityConfigurerAdapter {
//
//    // 装载BCrypt密码编码器
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new MessageDigestPasswordEncoder("MD5");
////        return new BCryptPasswordEncoder(10);
//    }
//
//
//    @Autowired()
//    EDefaultWebSecurityExpressionHandler ewebSecurityExpressionHandler;
//
//    @Bean
//    EDefaultWebSecurityExpressionHandler ewebSecurityExpressionHandler() {
//        EDefaultWebSecurityExpressionHandler webSecurityExpressionHandler = new EDefaultWebSecurityExpressionHandler();
//        return webSecurityExpressionHandler;
//    }
//    //配置权限校验
//    @Bean
//    PermissionEvaluator permissionEvaluator() {
//        EPermissionEvaluator permissionEvaluator = new EPermissionEvaluator();
//        return permissionEvaluator;
//    }
//
//    @Bean
//    EAuthenticationFailureHandler eauthenticationFailureHandler() {
//        return new EAuthenticationFailureHandler();
//    }
//
//    @Autowired
//    public void configureAuthentication(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
//        authenticationManagerBuilder
//                // 设置UserDetailsService
//                .userDetailsService(this.userService)
//                // 使用BCrypt进行密码的hash
//                .passwordEncoder(passwordEncoder());
//    }
//
//    // 该方法是登录的时候会进入
//    @Override
//    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
//        authenticationManagerBuilder.inMemoryAuthentication();//这个干啥的？
////        authenticationManagerBuilder.parentAuthenticationManager(authenticationManager);//ProviderManager实现authenticationManager 认证管理器
//        authenticationManagerBuilder.userDetailsService(userService)
//                .passwordEncoder(passwordEncoder());//设置密码处理方式//设置用户校验方式
//    }
//
//
//
////    @Bean
////    public AuthenticationEntryPoint authenticationEntryPoint() {
////        return (request, response, exception) -> {
////            response.setCharacterEncoding("UTF-8");
////            response.setContentType("application/json; charset=utf-8");
////            if (exception instanceof BadCredentialsException) {
////                response.getWriter().write(JSON.toJSONString(Result.createFail(HttpServletResponse.SC_FORBIDDEN,"无token")));
//////                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
////            } else {
////                //401 没有授权
////                response.getWriter().write(JSON.toJSONString(Result.createFail(HttpServletResponse.SC_UNAUTHORIZED,"无授权")));
//////                response.setStatus();
////            }
////        };
////    }
//
//    @Override
//    protected void configure(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity.csrf()
//                .disable()// 由于使用的是JWT，我们这里不需要csrf
//                .addFilterBefore(new CorsFilter(), ChannelProcessingFilter.class)
//                .addFilterBefore(new VerifyTokenFilter(), UsernamePasswordAuthenticationFilter.class)
//                .addFilterBefore(new MyUsernamePasswordAuthenticationFilter("/login",authenticationManager()), UsernamePasswordAuthenticationFilter.class);
//        //表达式拦截器 注册表
//        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry authorizeRequests = httpSecurity
//                .authorizeRequests();
//        authorizeRequests.expressionHandler(ewebSecurityExpressionHandler());//验证人员是否有权限的过滤
//        // 403  未登录请求资源  EAccessDeniedHandler 没有权限的处理
//        httpSecurity.exceptionHandling().authenticationEntryPoint(new Jwt403AuthenticationEntryPoint())
//                .accessDeniedHandler(new EAccessDeniedHandler());
//        //需要权限的资源配置??? 权限设置后这里需要重启
//        //permissionVoList: 绑定了角色的资源
//        List<PermissionVo> permissionVoList=resourcesService.query(PermissionVo.class, CustomQuery.ofAnd("roleId").isNotNull());
//        for(PermissionVo vo:permissionVoList){
//            if(vo.getRole()!=null&&vo.getRole().getGroupList()!=null){
//                List<String> groupIds = vo.getRole().getGroupList().stream().map(SysGroup::getId)
//                        .collect(Collectors.toList());
//                // 资源路径与角色组绑定
//                authorizeRequests.antMatchers("/**/"+vo.getUrl())
//                        .access("hasPermission('','" + groupIds.toString() + "')");
//
//            }}
//        authorizeRequests.antMatchers("/sys/user/register","/disScreen/auto/create","/open/api/getToken","/demo/**",
//                        "/api/report:team",
//                        "/api/report:org",
//                        "/api/report:doc",
//                        "/api/report:equipment").permitAll().anyRequest().authenticated()
//                .and().formLogin()
//                .failureHandler(eauthenticationFailureHandler())
//                .and()
//                .logout()
//                .permitAll();
//    }
//
//    public static void main(String[] args) {
//        System.out.println(new MessageDigestPasswordEncoder("MD5").encode("123456"));
//    }
//}
