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
import cn.wwwlike.vlife.objship.read.ModelReadCheck;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.annotation.Order;
/**
 *   bean容器启动前
 *  加载模型信息
 */
@Order(1)
public class VlifeApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext>{
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        ModelReadCheck modelReadCheck=new ModelReadCheck();
        Integer errNum= modelReadCheck.load(loader);//模型读取
        if(errNum>0){
            logger.info("[vlife] 容器初始化失败，请按照规范编写各类模型");
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
