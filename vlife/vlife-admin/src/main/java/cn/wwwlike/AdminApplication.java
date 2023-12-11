package cn.wwwlike;

import cn.wwwlike.auth.config.UniqueNameGenerator;
import cn.wwwlike.web.annotation.EnableRespWrap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author xiaoyu
 * @date 2022/6/17
 */
@EnableRespWrap
@SpringBootApplication(scanBasePackages ={
        "cn.wwwlike.auth",
        "cn.wwwlike.sys",
        "cn.wwwlike.form",
        "cn.wwwlike.demo",
},nameGenerator =UniqueNameGenerator.class )
public class AdminApplication {
    public static void main(String[] args) {
        //请注意，使用本项目需要安装Java环境并使用JDK8。
        // 在启动项目之前，需要运行`Maven install`命令初始化项目所需的文件。
        // 如果数据库实体模型发生变化，也需要再次运行`Maven install` 命令，以产生QueryDSL相关文件。
        // 此外，如果Java中的其他模型（如VO、DTO和Req）发生变化并需要立即更新到前端，请同样运行`Maven install`命令进行同步。
        SpringApplication.run(AdminApplication.class);
    }
}
