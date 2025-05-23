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

package cn.wwwlike.web.configuration;

import cn.wwwlike.web.exception.conf.UnifiedExceptionHandler;
import cn.wwwlike.web.exception.conf.UnifiedMessageSource;
import cn.wwwlike.web.params.CommonResponseAdvice;
import org.springframework.context.annotation.Bean;

/**
 * 返回数据包装
 */
public class RespWrapConfiguration {
    @Bean
    public CommonResponseAdvice wrap(){
        return new CommonResponseAdvice();
    }
    @Bean
    public UnifiedExceptionHandler ExceptionHandler(){
        return new  UnifiedExceptionHandler();
    }
    @Bean
    public UnifiedMessageSource unifiedMessageSource(){
        return new UnifiedMessageSource();
    }

}
