package cn.wwwlike.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;

//演示环境数据库重置
@Component
public class DatabaseRestoreTask {

    @Autowired
    private Environment env;

    @Autowired
    private DbDataInitializer dbDataInitializer;

    public String getActiveProfile() {
        return env.getProperty("spring.profiles.active");
    }

//    @Scheduled(cron = "0 0 12,0 * * ?")// 每天中午12,24点执行一次
//    @Scheduled(cron = "0 0,30 * * * ?")//每隔30分钟执行
//    @Scheduled(cron = "0 * * * * ?")//每隔一分钟
//    @Scheduled(cron = "0 0 * * * ?") // 每小时执行一次
   public void restoreDatabase() throws IOException {
       if(getActiveProfile().equals("mysql")){
//        dbDataInitializer.clearTable();
//        dbDataInitializer.dataRestore();
       }
    }
}