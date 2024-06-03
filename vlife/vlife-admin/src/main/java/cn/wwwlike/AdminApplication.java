package cn.wwwlike;

import cn.wwwlike.auth.config.UniqueNameGenerator;
import cn.wwwlike.web.annotation.EnableRespWrap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author xiaoyu
 * @date 2022/6/17
 */
@EnableRespWrap
@EnableScheduling
@SpringBootApplication(scanBasePackages ={
        "cn.wwwlike.auth",
        "cn.wwwlike.sys",
        "cn.wwwlike.excel",
        "cn.wwwlike.form",
        "cn.wwwlike.vlife.ts",
        "cn.wwwlike.vlife.gitee",
        "cn.wwwlike.plus",
        "cn.vlife.erp"
},nameGenerator =UniqueNameGenerator.class )
@EntityScan(basePackages = {"cn.wwwlike", "cn.vlife"})
public class AdminApplication {
    public static void main(String[] args) {
        System.out.println("╔════════════════════════════════════════════════════════════════╗");
        System.out.println("               注意！！注意！！(AadminApplication)                ");
        System.out.println("               检查本项目是否配置了JDK8以上的运行环境。            ");
        System.out.println("       首次请务必整个项目运行`Maven package`初始化项目所需的文件。  ");
        System.out.println("  研发过程中(do/vo/dto)有变化改动请在vlife-admin上运行maven package ");
        System.out.println("╚════════════════════════════════════════════════════════════════╝");
        SpringApplication.run(AdminApplication.class);
    }
}
