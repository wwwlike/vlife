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

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 报表统计项
 */
@Data
@Entity
@Table(name = "report_item")
public class ReportItem extends DbEntity {
    /**
     * 统计项名称
     */
    public String name;
    /**
     * 统计项编码
     */
    public String code;
    /**
     * 聚合方式
     * count时 fieldName 则联动为ID
     */
    @VField(dictCode = "ITEM_FUNC")
    public String func;
    /**
     * 所在模型
     */
    public String formId;
    /**
     * 聚合字段
     */
    public String fieldName;
    /**
     * 过滤条件
     * 非必填，与fromId联动
     */
    public String formConditionId;
    /**
     * 聚合过滤条件(待)
     */
    public String havingFilter;

}
