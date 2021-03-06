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

package cn.wwwlike.vlife.annotation;

import cn.wwwlike.vlife.base.Item;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static cn.wwwlike.vlife.dict.Constants.DEFAULT_ORDER_TYPE;

/**
 * 所有pojo类注解，约定之外增加灵活性
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface VClazz {
    /**
     * 删除当前类，那么级联清楚本表的外键的类
     */
    Class<? extends Item>[] clear() default {};

    /**
     * 删除当前类，那么级联清楚的类，原先是clear,现在remove
     */
    Class<? extends Item>[] remove() default {};

    /**
     * 不级联操作
     */
    Class<? extends Item>[] nothing() default {};

    /**
     * 默认实体类的排序方式
     **/
    String orders() default DEFAULT_ORDER_TYPE;
}
