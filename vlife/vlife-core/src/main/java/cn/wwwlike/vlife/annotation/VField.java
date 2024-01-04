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
 * 模型原元数据(pojo属性)的注解，在约定之外增加灵活性
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Documented
public @interface VField {
    /**
     * 实体字段路径
     * 表示对应的实体字段路径。如果vo/req/dto下的字段与实体下的字段不匹配，需要在注解属性上指定对应的路径。
     * 关联和外键的字段，需要加上下划线；如：userVo注入sysDept部门的name 则在userVo下,按规则应该有 sysDept_name字段，但是一般来说会命名为 deptName;
     * 则注解就需要跟上协商 pathName="sysDept_name";
     */
    String pathName() default "";
    /**
     * 查询方式
     * 查询模型使用
     */
    Opt opt() default  Opt.VOID;
    /**
     * 注入字段设置它的排序规则->可覆盖实体类和VO上设置的排序规则，
     */
    String orders() default DEFAULT_ORDER_TYPE;
    /**
     * 数据查询&转换的方法 适用于统计分组的函数
     */
    Class<? extends DataExpressTran> tran() default DataExpressTran.class;
    /**
     * 进行and联合查询的其他字段，
     * 查询模型使用
     */
    String[] andReqFields() default {};
    /**
     * 进行or联合查询的其他字段
     * 查询模型使用
     */
    String[] orReqFields() default {};
    /**
     * 字典编码
     * 数据来源是字典则设置，也可通过配置功能设置或者覆盖
     */
    String dictCode() default "";

    /**
     * 字段跳过不扫描
     * 一般作为实现特定逻辑的判断条件使用
     */
    boolean skip() default false;
    /**
     *  字段失效
     *  后续版本不在使用的字段
     */
    boolean expire() default  false;

}