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

package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 单个查询统计项目
 */
@Data
@Entity
@Table(name = "form_item")
public class FormItem extends DbEntity {
    /**
     * 查询名称
     */
    public String name;
    /**
     * 查询类型
     */
    public String itemType;
    /**
     * 实体名称
     */
    public String entityName;
    /**
     * 查询字段
     */
    public String fieldName;
    /**
     * 查询模型id
     */
    public String formId;
    /**
     * 查询标识
     */
    public String code;
    /**
     * 查询聚合条件
     */
    public String conditionJson;

}
