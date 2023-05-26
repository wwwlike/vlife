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

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 统计项
 * 用于统计数量的；可作为报表展示的最小单元；也可以作为图表数据源；还可以用2个统计项做分子坟墓来计算指标；
 *
 * ------------------------------
 * 1. 统计项可以单独添加过滤条件,但是首先应该遵循该统计项所在业务的默认的行级数据查询规则范围内累加过滤规则；另外如果是用在报表的统计项，那么可以累加报表里添加的查询规则
 * 3. 对item分组，就会产生多列数据；（字典类型的数据进行分组，非字典外键类型的数据在report里进行分组）
 * (多个表头)；name是一级表头，分组的内容是2级表头；如订单状态是一级表头；二级表头会是，进行中、已完成（待）
 *
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
     * 可以是 table_field_func
     */
    public String code;
    /**
     * 所在模型
     */
    public String formId;
    /**
     * 聚合方式
     * count时 fieldName 则联动为ID
     */
    @VField(dictCode = "ITEM_FUNC")
    public String func;
    /**
     * 统计字段
     */
    public String fieldName;
    /**
     * 过滤条件
     */
    public String conditionJson;
    /**
     *
     */
    public String groupBy;

}
