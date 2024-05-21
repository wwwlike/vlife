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
 * 复杂设计器数据dto
 * 支持条件嵌套
 * (当前 组内是可以设置orAnd, 其实一个组内应该就是and)
 */
@Data
public class Conditions {
    /**
     * 查询主体
     */
    public String entityName;
    /**
     * 组内过滤条件
     */
    public List<Where> where = new ArrayList<>();
    /**
     * 同级其他过滤组条件 (递归)
     */
    public List<Conditions> conditions;
    /**
     * 关联方式
     * 组内关联方式 a1 and (a or b or (c and d and e) or f)
     */
    public String orAnd;

}

