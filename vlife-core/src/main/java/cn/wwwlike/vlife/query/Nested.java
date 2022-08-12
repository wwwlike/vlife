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

package cn.wwwlike.vlife.query;

import cn.wwwlike.vlife.base.Item;

import java.io.Serializable;
import java.util.function.Consumer;

/**
 * 括号查询
 */
public interface Nested<Param, Children> extends Serializable {
    /**
     * ignore
     */
    default Children and(Consumer<Param> consumer) {
        return and(true, consumer);
    }

    /**
     * or 嵌套
     */
    Children and(boolean condition, Consumer<Param> consumer);

    /**
     * ignore
     */
    default Children or(Consumer<Param> consumer) {
        return or(true, consumer);
    }

    /**
     * or 嵌套
     */
    Children or(boolean condition, Consumer<Param> consumer);


    /**
     *  子查询语句创建
     * @param subMainClz 子查询里的主查询对象，和外围表需要有外键关系
     * @param consumer 子查询里的查询条件包裹封装
     * @param leftPathClz 子查询条件里关联到外键表的实体路径
     * @return
     */
    default Children andSub(Class<? extends Item> subMainClz, Consumer<Param> consumer, Class<? extends Item>... leftPathClz) {
        return andSub(true, subMainClz, consumer, leftPathClz);
    }

    /**
     * AND 嵌套子查询 mainId in
     *
     * @param condition   执行条件
     * @param subMainClz  创建子查询的 主表entityClz
     * @param consumer    子查询语句
     * @param leftPathClz 子查询主表id所在类的路径，数组最后一个就是mainId 所在的类
     * @return
     */
    Children andSub(boolean condition, Class<? extends Item> subMainClz, Consumer<Param> consumer, Class<? extends Item>... leftPathClz);
}
