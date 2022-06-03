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

import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.DataExpressTran;

import java.lang.annotation.*;

import static cn.wwwlike.vlife.dict.Constants.DEFAULT_ORDER_TYPE;

/**
 * 所有pojo对象上属性的注解
 * 约定之外增加灵活性
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Documented
public @interface VField {
    /**
     * 字段路径名称&真实数据库对应字段
     *
     * @return
     */
    String pathName() default "";

    /**
     * 查询方式-> req对象使用
     *
     * @return
     */
    Opt opt() default Opt.eq;

    /**
     * 注入字段设置它的排序规则->可覆盖实体类和VO上设置的排序规则，
     *
     * @return
     */
    String orders() default DEFAULT_ORDER_TYPE;

    /**
     * 数据查询&转换的方法 适用于统计分组的函数
     *
     * @return
     */
    Class<? extends DataExpressTran> tran() default DataExpressTran.class;


    /**
     * 进行and联合查询的其他字段，目前支持到主表的字段
     *
     * @return
     */
    String[] andReqFields() default {};

    /**
     * 进行or联合查询的其他字段，目前支持到主表的字段
     *
     * @return
     */
    String[] orReqFields() default {};
}