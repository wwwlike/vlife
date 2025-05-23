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

package cn.wwwlike.vlife.bi;

import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.core.dsl.QModel;

/**
 * 子查询主要是定位数据，然后与主查询进行exist查询关联
 * 子查询的分组可以更细一层，完成
 */
public interface BiCondition<T extends Item> {

    /**
     * field查询默认的查询函数
     *
     * @return
     */
    default FunctionEnum func() {
        return FunctionEnum.count;
    }

    /**
     * 子查询里默认聚合的字段
     *
     * @return
     */
    default String column() {
        return "id";
    }

    /**
     * ???
     * 本级三个条件的设置 （group,req,having）
     *
     * @param mainReq 主查询条件
     * @return
     */
    public GroupWrapper<T> condition(final GroupWrapper<T> mainReq, QModel<T> model);


}
