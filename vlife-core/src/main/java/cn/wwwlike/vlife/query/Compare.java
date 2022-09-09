
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

/**
 * 条件比较
 *
 * @param <Children>
 * @param <R>
 */
public interface Compare<Children, R> extends Serializable {
    /**
     * 以eq进行手工过滤介绍
     * @param condition 查询执行的先决条件
     * @param column 查询匹配字段
     * @param val 查询匹配值
     * @param tran 字段转换接口
     * @param leftClz 查询column是外键表上的字段，那么这里写做关联class集合
     * @return
     */
    Children eq(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children eq(R column, Object val) {
        return this.eq(true, column, val);
    }

    default Children eq(boolean condition, R column, Object val) {
        return this.eq(condition, column, val, null);
    }

    default Children eq(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.eq(condition, column, val, null, leftClz);
    }

    default Children eq(R column, Object val, Class<? extends Item>... leftClz) {
        return this.eq(true, column, val, leftClz);
    }

    Children in(boolean condition, R column, Object[] val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children in(boolean condition, R column, Object[] val, Class<? extends Item>... leftClz) {
        return this.in(condition, column, val, null, leftClz);
    }

    default Children in(boolean condition, R column, Object[] val) {
        return this.in(condition, column, val, null);
    }

    default Children in(R column, Object[] val, Class<? extends Item>... leftClz) {
        return this.in(true, column, val, leftClz);
    }

    default Children in(R column, Object[] val) {
        return this.in(true, column, val);
    }


    Children notIn(boolean condition, R column, Object[] val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children notIn(boolean condition, R column, Object[] val, Class<? extends Item>... leftClz) {
        return this.notIn(condition, column, val, null, leftClz);
    }

    default Children notIn(boolean condition, R column, Object[] val) {
        return this.in(condition, column, val, null);
    }

    default Children notIn(R column, Object[] val, Class<? extends Item>... leftClz) {
        return this.notIn(true, column, val, leftClz);
    }

    default Children notIn(R column, Object[] val) {
        return this.in(true, column, val);
    }

    Children like(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children like(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.like(condition, column, val, null, leftClz);
    }

    default Children like(R column, Object val) {
        return this.like(true, column, val);
    }

    default Children like(R column, Object val, Class<? extends Item>... leftClz) {
        return this.like(true, column, val, leftClz);
    }

    default Children like(boolean condition, R column, Object val) {
        return this.like(condition, column, val, null);
    }

    /**
     * likeLeft查询
     */
    Children startsWith(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children startsWith(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.startsWith(true, column, val, null, leftClz);
    }

    default Children startsWith(R column, Object val) {
        return this.startsWith(true, column, val);
    }

    default Children startsWith(R column, Object val, Class<? extends Item>... leftClz) {
        return this.startsWith(true, column, val, leftClz);
    }

    default Children startsWith(boolean condition, R column, Object val) {
        return this.startsWith(condition, column, val, null);
    }

    Children isNotNull(boolean condition, R column, Class<? extends Item>... leftClz);

    default Children isNotNull(R column) {
        return this.isNotNull(true, column);
    }

    default Children isNotNull(R column, Class<? extends Item>... leftClz) {
        return this.isNotNull(true, column, leftClz);
    }

    default Children isNotNull(boolean condition, R column) {
        return this.isNotNull(condition, column, null);
    }

    Children isNull(boolean condition, R column, Class<? extends Item>... leftClz);

    default Children isNull(R column) {
        return this.isNull(true, column);
    }

    default Children isNull(R column, Class<? extends Item>... leftClz) {
        return this.isNull(true, column, leftClz);
    }

    default Children isNull(boolean condition, R column) {
        return this.isNull(condition, column, null);
    }

    Children ne(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children ne(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.ne(condition, column, val, null, leftClz);
    }

    default Children ne(R column, Object val, Class<? extends Item>... leftClz) {
        return this.ne(true, column, val, leftClz);
    }

    default Children ne(boolean condition, R column, Object val) {
        return this.ne(true, column, val, null);
    }

    default Children ne(R column, Object val) {
        return this.ne(true, column, val);
    }

    Children gt(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children gt(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.gt(condition, column, val, null, leftClz);
    }

    default Children gt(R column, Object val, Class<? extends Item>... leftClz) {
        return this.gt(true, column, val, leftClz);
    }

    default Children gt(boolean condition, R column, Object val) {
        return this.gt(true, column, val, null);
    }

    default Children gt(R column, Object val) {
        return this.gt(true, column, val);
    }

    Children goe(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children goe(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.goe(condition, column, val, null, leftClz);
    }

    default Children goe(R column, Object val, Class<? extends Item>... leftClz) {
        return this.goe(true, column, val, leftClz);
    }

    default Children goe(boolean condition, R column, Object val) {
        return this.goe(true, column, val, null);
    }

    default Children goe(R column, Object val) {
        return this.goe(true, column, val);
    }

    Children lt(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children lt(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.lt(condition, column, val, null, leftClz);
    }

    default Children lt(R column, Object val, Class<? extends Item>... leftClz) {
        return this.lt(true, column, val, leftClz);
    }

    default Children lt(boolean condition, R column, Object val) {
        return this.lt(true, column, val, null);
    }

    default Children lt(R column, Object val) {
        return this.lt(true, column, val);
    }

    Children loe(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children loe(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.loe(condition, column, val, null, leftClz);
    }

    default Children loe(R column, Object val, Class<? extends Item>... leftClz) {
        return this.loe(true, column, val, leftClz);
    }

    default Children loe(boolean condition, R column, Object val) {
        return this.loe(true, column, val, null);
    }

    default Children loe(R column, Object val) {
        return this.loe(true, column, val);
    }

    Children between(boolean condition, R column, Object val1, Object val2, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children between(boolean condition, R column, Object val1, Object val2, Class<? extends Item>... leftClz) {
        return this.between(condition, column, val1, val2, null, leftClz);
    }

    default Children between(R column, Object val1, Object val2, Class<? extends Item>... leftClz) {
        return this.between(true, column, val1, val2, leftClz);
    }

    default Children between(boolean condition, R column, Object val1, Object val2) {
        return this.between(condition, column, val1, val2, null);
    }

    default Children between(R column, Object val1, Object val2) {
        return this.between(true, column, val1, val2);
    }

    Children notBetween(boolean condition, R column, Object val1, Object val2, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children notBetween(boolean condition, R column, Object val1, Object val2, Class<? extends Item>... leftClz) {
        return this.notBetween(condition, column, val1, val2, null, leftClz);
    }

    default Children notBetween(R column, Object val1, Object val2, Class<? extends Item>... leftClz) {
        return this.notBetween(true, column, val1, val2, leftClz);
    }

    default Children notBetween(boolean condition, R column, Object val1, Object val2) {
        return this.between(condition, column, val1, val2, null);
    }

    default Children notBetween(R column, Object val1, Object val2) {
        return this.notBetween(true, column, val1, val2);
    }

    Children notLike(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children notLike(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.notLike(condition, column, val, null, leftClz);
    }

    default Children notLike(R column, Object val) {
        return this.like(true, column, val);
    }

    default Children notLike(R column, Object val, Class<? extends Item>... leftClz) {
        return this.notLike(true, column, val, leftClz);
    }

    default Children notLike(boolean condition, R column, Object val) {
        return this.notLike(condition, column, val, null);
    }

    Children endsWith(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz);

    default Children endsWith(boolean condition, R column, Object val, Class<? extends Item>... leftClz) {
        return this.endsWith(condition, column, val, null, leftClz);
    }

    default Children endsWith(R column, Object val) {
        return this.like(true, column, val);
    }

    default Children endsWith(R column, Object val, Class<? extends Item>... leftClz) {
        return this.notLike(true, column, val, leftClz);
    }

    default Children endsWith(boolean condition, R column, Object val) {
        return this.notLike(condition, column, val, null);
    }

}




