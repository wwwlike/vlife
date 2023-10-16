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

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 统计项目查询分组条件
 * 分析:
 * 1. 看作是req，是否可以把conditions堪称是reqDto
 * 2. where是req里的字段
 */
@Data
public class Conditions {
    /**
     * 查询主体
     */
    public String entityName;
    /**
     * 分组条件
     */
    public List<Conditions> conditions;
    /**
     * 关联方式
     * 括号内关联方式
     */
    public String orAnd;
    /**
     * 过滤条件(支持递归)
     */
    public List<Where> where = new ArrayList<>();

}

