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

package cn.wwwlike.config;
import cn.vlife.generator.TitleJson;
import cn.vlife.utils.VlifePathUtils;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysUserService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.web.security.core.*;
import cn.wwwlike.web.security.filter.MyUsernamePasswordAuthenticationFilter;
import cn.wwwlike.web.security.filter.VerifyTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.util.List;
import static cn.wwwlike.config.VlifeFilterInvocationSecurityMetadataSource.PUBLIC_URLS;

@Configuration
@ConditionalOnExpression("${security.basic.enable:true}")
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private SessionRegistry sessionRegistry;
    @Autowired
    private SysUserService userService;
    @Autowired
    SysResourcesService resourcesService;
    @Autowired
    FormService formService;

    @Autowired
    public VlifeUrlDecisionManager customUrlDecisionManager;
    @Autowired
    public VlifeFilterInvocationSecurityMetadataSource customGroupSimpleFilterInvocationSecurityMetadataSource;

    // 装载密码编码器
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new MessageDigestPasswordEncoder("MD5");
    }

    @Bean
    EAuthenticationFailureHandler eauthenticationFailureHandler() {
        return new EAuthenticationFailureHandler();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    //设置密码处理方式 设置用户校验方式
    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.inMemoryAuthentication();
        authenticationManagerBuilder.userDetailsService(userService)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf()
                .disable()
                .addFilterBefore(new CorsFilter(), ChannelProcessingFilter.class)
                .addFilterBefore(new VerifyTokenFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new MyUsernamePasswordAuthenticationFilter("/vlife/login", authenticationManager()), UsernamePasswordAuthenticationFilter.class)
                .sessionManagement()
                .maximumSessions(1)
                .sessionRegistry(sessionRegistry);
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry authorizeRequests = httpSecurity
                .authorizeRequests();
        httpSecurity.exceptionHandling().authenticationEntryPoint(new Jwt403AuthenticationEntryPoint())
                .accessDeniedHandler(new EAccessDeniedHandler());
        try {
            if (!VlifePathUtils.isRunningFromJar()) {
                List<ClzTag> tags= TitleJson.getJavaClzTag();
                //模型信息(form/formField)同步java模型(标准版)
                GlobalData.allModels().stream().forEach(javaDto -> {
                    ClzTag tag=tags.stream().filter(t->t.getEntityName().toLowerCase().equals(javaDto.getType().toLowerCase())).findFirst().get();
                    formService.syncOne(javaDto,tag);
                });
                //接口同步
                resourcesService.sync();
            }
        }catch (Exception e){
            e.printStackTrace();
            System.out.println("╔════════════════════════════════════════════════════════════════╗");
            System.out.println("║                                                                ║");
            System.out.println("║                please run 'mvn package' command.               ║");
            System.out.println("║                                                                ║");
            System.out.println("╚════════════════════════════════════════════════════════════════╝");
            System.exit(0); // Exit without starting the application
        }
        //动态权限
        authorizeRequests
                .withObjectPostProcessor(new ObjectPostProcessor<FilterSecurityInterceptor>() {
                    @Override
                    public <O extends FilterSecurityInterceptor> O postProcess(O object) {
                        object.setAccessDecisionManager(customUrlDecisionManager);
                        object.setSecurityMetadataSource(customGroupSimpleFilterInvocationSecurityMetadataSource);
                        return object;
                    }
                });
        authorizeRequests.antMatchers(
                        PUBLIC_URLS.toArray(new String[0])
                ).permitAll().anyRequest().authenticated()
                .and().formLogin()
                .failureHandler(eauthenticationFailureHandler())
                .and()
                .logout()
                .permitAll();
    }

    /**
     * 得到当前用户
     * @return
     */
    public static SecurityUser getCurrUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        } else {
            try {
                return (SecurityUser) SecurityContextHolder.getContext().getAuthentication().getDetails();
            } catch (Exception ex) {
                return null;
            }
        }
    }

    public static void main(String[] args) {
        System.out.println(new MessageDigestPasswordEncoder("MD5").encode("123456"));
    }
}
