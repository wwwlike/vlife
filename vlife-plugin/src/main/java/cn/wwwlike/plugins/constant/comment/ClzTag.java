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

package cn.wwwlike.plugins.constant.comment;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * 类注释信息
 */
@Data
public class ClzTag {
    public String entityName;
    /**
     * 类名称
     */
    public String title;
    /**
     * 类字段信息
     */
    public Map<String, FieldTag> tags;

    public ClzTag() {
        this.tags = new HashMap<String, FieldTag>();
    }
}
