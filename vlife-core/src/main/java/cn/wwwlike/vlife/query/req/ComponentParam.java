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

package cn.wwwlike.vlife.query.req;

import lombok.Data;

import java.util.List;

/**
 * 组件数据异步加载所需要的数据
 * 不是都用，这里给全量
 */
@Data
public class ComponentParam {
    /**
     * 组件所在实体名称
     */
    public String  entityType;
    /**
//     * 组件所在模型
//     */
//    public String  modelName;
//    /**
//     * 行记录id
//     */
//    public String id;
//    /**
//     * 组件字段
//     */
//    public String fieldName;
//    /**
//     * 字段值
//     */
//    public Object[] val;

    public Object[] ids;
}
