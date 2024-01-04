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

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.StringUtils;
import lombok.Data;

/**
 * 字段类型元素基础类型字段的信息
 */
@Data
public class FieldInfo extends ClazzInfo {
    /** 字段名称 */
    public String fieldName;
    /** 真实路径名称*/
    public String pathName;
    /** 字段类型 */
    public String fieldType;
    /** 所在实体*/
    public String entityType;
    /** 字段值来源的实体字段名称 */
    public String entityFieldName;
    /** 字典的code */
    public String dictCode;
    // -----待移除-------------
    /**字段在页面显示状态1不显示，2只读， 3可写 */
    public String uiState;
    /** 解析状态*/
    @JsonIgnore
    public String state;

    public String getPathName() {
        if (this.pathName == null) {
            return this.getFieldName();
        }
        return this.pathName;
    }
    public void setEntityType(String entityType){
        this.entityType= StringUtils.uncapitalize(entityType);
    }

    public String getEntityType(){
        return StringUtils.uncapitalize(entityType);
    }

}

