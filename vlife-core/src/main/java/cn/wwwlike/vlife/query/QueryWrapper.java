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

/**
 * 查询包裹条件的实现类
 *
 * @param <T>
 */
public class QueryWrapper<T extends Item> extends AbstractWrapper<T, String, QueryWrapper<T>> {
    public QueryWrapper(Class<T> entity) {
        super.entityClz = entity;
    }

    public static <E extends Item> QueryWrapper<E> of(Class<E> clz) {
        return new QueryWrapper<E>(clz);
    }

    /**
     * 添加子类时使用
     *
     * @param parent
     * @return
     */
    @Override
    public QueryWrapper<T> instance(QueryWrapper<T> parent) {
        QueryWrapper query = new QueryWrapper(parent.entityClz);
        query.entityClz = parent.entityClz;
        query.parent = parent;
        return query;
    }


}

