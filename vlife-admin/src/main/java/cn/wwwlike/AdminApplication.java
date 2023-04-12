package cn.wwwlike;

import cn.wwwlike.web.annotation.EnableRespWrap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author xiaoyu
 * @date 2022/6/17
 */
//打开出参数据包装
@EnableRespWrap
@SpringBootApplication(scanBasePackages ={
        "cn.wwwlike.auth",
        "cn.wwwlike.oa",
        "cn.wwwlike.sys",
        "cn.wwwlike.vlife.ts",
        "cn.wwwlike.vlife.gitee",
        "cn.wwwlike.form"})
public class AdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminApplication.class);
    }
}
