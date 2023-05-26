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

package cn.wwwlike.plus.report.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 报表配置(主)
 * 目前是单一实体的报表，并只支持一个字段分组(维度)；
 * GPT :报表还应该扩展筛选器、排序器、分组器
 *
 * 1. 报表可以传入查询条件对整体数据进行过滤（报表是列表，对应有个req作为该表的过滤条件），多表组合时候则把相同字段能作为过滤条件
 * 2. 每个统计项/或者子标的数据计算如果有where也需要累加整表的
 * 3. 一个报表可以对应有多个分组条件；可以按其中一个进行分组，也可以组合一起分组（二期实现）
 */
@Table(name = "report_table")
@Entity
@Data
public class ReportTable extends DbEntity {
    /**
     * 报表名称
     */
    public String name;
    /**
     * 报表编码
     */
    public String code;
    /**
     * 实体模型
     */
    public String formId;
    /**
     * 分组字段
     * 来源于formId里的字段（联动的）
     */
    public String groupColumn;
    /**
     * 分组聚合函数
     * 根据groupColumn字段的类型（date,string,number）来确定能用什么函数
     *  举例：对分组的字段进行函数计算，得到更精准的分组数据（group by  year(date)）
     */
    public String func;


}
