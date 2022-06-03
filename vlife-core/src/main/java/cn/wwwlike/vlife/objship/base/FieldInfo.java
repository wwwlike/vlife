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

package cn.wwwlike.vlife.objship.base;

import lombok.Data;

/**
 * 字段类型元素基础类型字段的信息
 */
@Data
public class FieldInfo extends ClazzInfo {
    public String fieldName;
    public String pathName;
    public String fieldType;
    public String entityType;
    public String entityFieldName;
    public String state;

    public String getPathName() {
        if (this.pathName == null) {
            return this.getFieldName();
        }
        return this.pathName;
    }

}


