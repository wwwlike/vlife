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

package cn.wwwlike.vlife.objship.dto;

import cn.wwwlike.vlife.objship.base.ItemInfo;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 所有模型dto信息基类
 */
public abstract class BeanDto<T> extends ItemInfo {
    /* 当前模型对象clz */
    public Class<? extends T> clz;
    /* 当前模型的字段信息集合*/
    public List<FieldDto> fields;

    public Class<? extends T> getClz() {
        return clz;
    }
    public void setClz(Class<? extends T> clz) {
        this.clz = clz;
    }
    public List<FieldDto> getFields() {
        return fields;
    }
    public void setFields(List<FieldDto> fields) {
        this.fields = fields;
    }

    /**
     *  根据字段类型查找字段信息集合
     *  （basic/list）
     */
    public List<FieldDto> filter(String... fieldType) {
        List<FieldDto> filters = null;
        if (fields != null) {
            filters = fields.stream().filter(f -> {
                return (Arrays.stream(fieldType).anyMatch(s -> f.getFieldType().equals(s)));
            }).collect(Collectors.toList());
        }
        return filters;
    }

    /**
     * 根据字段名查找单个字段信息
     */
    public Optional<FieldDto> find(String fieldName) {
        return getFields().stream().filter(f->f.getFieldName().equals(fieldName)).findAny();
    }
}


