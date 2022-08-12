package cn.wwwlike;

import cn.wwwlike.web.annotation.EnableRespWrap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author xiaoyu
 * @date 2022/6/17
 */
@EnableRespWrap//引入了该starter应该来说不需要这个开关，待把类改造成
@SpringBootApplication(scanBasePackages ={ "cn.wwwlike.auth","cn.wwwlike.oa","cn.wwwlike.sys"})
public class AdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminApplication.class);
    }
}
