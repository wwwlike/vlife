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
import lombok.Data;

/**
 * 子查询 三个条件的设置
 * 子查询三个条件的使用情况设置
 * 主查询三个条件的使用设置。
 */
@Data
public abstract class AbstractBiCondition<T extends Item> implements BiCondition<T> {
    /**
     * 子查询是否使用main的分组（使用）
     */
    private boolean useMainGroup = true;
    /**
     * 子查询是否使用main的req过滤条件（使用）
     */
    private boolean useMainReq = true;
    /**
     * 子查询是否使用main的分组后的过滤条件(不使用)
     */
    private boolean useMainHaving = false;

    /**
     * main查询是否使用子查询的过滤条件（使用）
     */
    private boolean useSubReq = true;

    /**
     * main查询是否使用子查询的分组后的过滤条件
     */
    private boolean useSubHaving = false;

    /**
     * sub是否使用自己的查询条件
     */
    private boolean useSelfReq = true;


    /**
     * sub是否使用自己的过滤条件
     */
    private boolean useSelfHaving = true;

    /**
     * main类是否使用自己的过滤条件，前提是有子查询
     */
    private boolean mainReq = true;
    /**
     * main类是否使用自己的分组过滤条件，前提是有子查询
     */
    private boolean mainHaving = true;


}
