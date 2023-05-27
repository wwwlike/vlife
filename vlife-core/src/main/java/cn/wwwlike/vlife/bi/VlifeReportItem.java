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

import cn.wwwlike.vlife.annotation.VField;
import lombok.Data;


/**
 * 报表统计项
 */
@Data
public class VlifeReportItem {

    /**
     * 项目名称
     */
    private String name;
    /**
     * 实体clz
     */
    private Class entityClz;
    /**
     * 项目编码
     */
    private String code;
    /**
     * 聚合字段
     */
    private String fieldName;
    /**
     * 聚合方式
     */
    @VField(dictCode = "ITEM_FUNC")
    private String func;
    /**
     * 过滤条件
     */
    private Conditions conditions;
    /**
     * 聚合过滤条件
     */
    private String havings;


}
