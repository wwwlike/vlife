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
 * 报表
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
     * 分组字段
     * 固定要支持一个字段的分组；越苏 子集item的实体类都需要有这个字段
     */
    public String groupColumn;

    /**
     * 分组聚合函数
     */
    public String func;

}
