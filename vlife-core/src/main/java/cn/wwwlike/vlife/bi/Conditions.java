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
 * 高级查询设计器查询条件的数据结构（支持条件嵌套）
 * 前端设计器支持一层嵌套，都会转换成该数据结构
 */
@Data
public class Conditions {
    /**
     * 关联方式
     * where1 and where2 and (a or b or f or (c and d and e))-> 括号内就是递归的conditions where1,where2就是 where数组部分
     */
    public String orAnd;
    /**
     * 单个过滤条件，where数据结构-> where1 `${orAnd}` where2 .... ${orAnd} whereN
     */
    public List<Where> where = new ArrayList<>();
    /**
     * 条件内的括号 (递归) -> (where1 `${orAnd}` where2)
     */
    public List<Conditions> conditions;
}

