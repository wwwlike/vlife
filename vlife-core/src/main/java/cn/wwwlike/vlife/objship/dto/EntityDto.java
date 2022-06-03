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

import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.objship.base.ISort;
import lombok.Data;

import java.util.*;

/**
 * 实体类信息读取DTO
 */
@Data
public class EntityDto extends BeanDto<Item> implements ISort {
    /**
     * 本表的外键字段
     */
    public List<FieldDto> fkFields = new ArrayList<>();
    /** 本表外键字段关联的表clz*/
    ;
    public List<Class<? extends Item>> fkTableClz;
    /**
     * 关联字段 entity主键ID在其他体表的作为外键的字段信息
     */
    public List<FieldDto> relationFields = new ArrayList<>();
    /* 外键表 other里所在实体类的信息 */;
    public List<Class<? extends Item>> relationTableClz;
    /**
     * 当前表的外键信息;key->外键表class，val->当前表的外键字段(存在于本表里)
     */
    public Map<Class<? extends Item>, String> fkMap = new HashMap<>();
    /**
     * 做级联删除时相关类及操作记录
     */
    public Map<Class<? extends Item>, String> deleteMap = new HashMap<>();
    /**
     * 排序字段
     */
    public String orders;

    /**
     * 是否是多对多的表
     */
    public boolean isM2M() {
        return this.getClz().getDeclaredFields().length == 2 && fkTableClz != null && fkTableClz.size() == 2;
    }

    /**
     * 查找符合的字段信息
     *
     * @param fieldName
     * @return
     */
    public Optional<FieldDto> find(String fieldName) {
        return getFields().stream().filter(field -> {
            return true;
        }).findFirst();
    }

    /**
     * 所有能够左查询的表
     *
     * @return
     */
    public List<Class<? extends Item>> getFkTableClz() {
        if (fkFields == null) {
            return null;
        } else {
            fkTableClz = new ArrayList<>();
            fkFields.forEach(field -> {
                fkTableClz.add(field.getEntityClz());
            });
            return fkTableClz;
        }
    }

    /**
     * 关联表，有当前表的ID作为外键的表
     *
     * @return
     */
    public List<Class<? extends Item>> getRelationTableClz() {
        if (relationFields == null) {
            return null;
        } else {
            relationTableClz = new ArrayList<>();
            relationFields.forEach(field -> {
                relationTableClz.add((Class<? extends Item>) field.getItemClz());
            });
            return relationTableClz;
        }
    }
}
