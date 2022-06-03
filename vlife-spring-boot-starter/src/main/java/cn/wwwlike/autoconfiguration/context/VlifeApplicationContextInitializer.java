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

import cn.wwwlike.autoconfiguration.init.LoadRelation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.annotation.Order;

@Order(123)
public class VlifeApplicationContextInitializer implements ApplicationContextInitializer {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        String packroot = applicationContext.getEnvironment().getProperty("vlife.packroot");
        new LoadRelation().load(packroot);
        logger.info("初始化类关系完毕");

    }
}
