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

package cn.wwwlike.autoconfiguration.context;

import cn.wwwlike.autoconfiguration.VlifeProperties;
import cn.wwwlike.vlife.objship.read.ModelReadCheck;
import org.apache.commons.lang3.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.net.URLClassLoader;

/**
 * 容器启动初始化
 * 1. 模型分析异常会启动失败（待注解分析，如果异常也启动失败）
 * 2. queryDsl生成类监测(待)
 */
@Order(1)
public class VlifeApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext>{
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        Environment environment = applicationContext.getEnvironment();
        String packages = environment.getProperty("vlife.packages");
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        Integer errNum=0;
        if(packages==null||"".equals(packages)){
            errNum=new ModelReadCheck().load(loader,"cn.wwwlike");//默认路径
        }else{
            errNum=new ModelReadCheck().load(loader,packages.split(","));
        }
        if(errNum>0){
            logger.info("[vlife] 容器初始化失败，请按照规范编写各类模型(http://vlife.cc/help/model)");
            exitApplication(applicationContext);
        }
        logger.info("[vlife] 模型关系读取完毕");
    }
    /**
     * 退出容器
     * @param context
     */
    public static void exitApplication(ConfigurableApplicationContext context) {
        int exitCode = SpringApplication.exit(context, (ExitCodeGenerator) () -> 0);
        System.exit(exitCode);
    }
}
