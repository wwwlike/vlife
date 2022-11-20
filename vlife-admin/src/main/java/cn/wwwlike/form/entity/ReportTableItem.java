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
 * 报表明细
 */
@Table(name = "report_table_item")
@Entity
@Data
public class ReportTableItem extends DbEntity {
    /**
     * 所属报表
     */
    public String reportTableId;
    /**
     * 统计项
     */
    public String reportItemId;

    /**
     * 排序号
     */
    public Integer sort;

    /**
     * 指标项
     */
    public String reportKpiId;

    /**
     * 项目标题(冗余)
     */
    public String title;

}
