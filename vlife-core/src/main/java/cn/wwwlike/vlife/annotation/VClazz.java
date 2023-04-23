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

import cn.wwwlike.base.common.RequestTypeEnum;
import cn.wwwlike.base.model.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;

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
     * 删除当前类，那么级联清除本表的外键的实体
     */
    Class<? extends Item>[] clear() default {};

    /**
     * 删除当前类，那么级联清除的实体类class
     */
    Class<? extends Item>[] remove() default {};

    /**
     * 不级联操作
     */
    Class<? extends Item>[] nothing() default {};


    /**
     * 禁止删除
     */
    Class<? extends Item>[] unableRm() default {};

    /**
     * req查询的默认请求方式,如果是post，则方法名称里没有list,page,
     * @return
     */
    RequestTypeEnum requestType() default RequestTypeEnum.NULL;

    /**
     * 注解所在类作为入参，那么希望返回的数据类型是
     * VoBean上部能有该注解
     * req\dto\item上可以有该注解
     * Class执行类型的去做查询
     * Integer.class返回执行的数量；
     * @return
     */
    Class returnType() default Object.class;

    /**
     * 类所属模块
     * @return
     */
    String  module() default  "";

    /**
     * 默认实体类的排序方式
     **/
    String orders() default DEFAULT_ORDER_TYPE;

    /**
     * page查询对象
     * @return
     */
    Class<? extends IdBean> pageVoClz() default Item.class;
}
