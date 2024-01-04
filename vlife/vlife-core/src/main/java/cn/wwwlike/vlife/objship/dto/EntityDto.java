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
    /** 外键字段信息 */
    public List<FieldDto> fkFields = new ArrayList<>();
    /** 外键模型信息 */
    public List<Class<? extends Item>> fkTableClz;
    /** 关联字段信息(id作为他表外键) */
    public List<FieldDto> relationFields = new ArrayList<>();
    /** 关联模型信息 */;
    public List<Class<? extends Item>> relationTableClz;
    /** 外键map(key外键类clz,val字段名) */
    public Map<Class<? extends Item>, String> fkMap = new HashMap<>();
    /** 级联删除map key级联类clz,val级联删除方式(remove,clear,nothing)*/
    public Map<Class<? extends Item>, String> deleteMap = new HashMap<>();
    /** 排序字段 */
    public String orders;
    /** 标题表达式 对应->vclazz label */
    public String itemName;
    /** 是否是多对多的表  */
    public boolean isM2M() {
        return this.getClz().getDeclaredFields().length == 2 && fkTableClz != null && fkTableClz.size() == 2;
    }

    /** 能够leftjoin左查询的表 */
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

    /** 关联表，有当前表的ID作为外键的表 */
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
