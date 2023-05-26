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

package cn.wwwlike.plus.report.vo;

import cn.wwwlike.form.entity.Form;
import cn.wwwlike.plus.report.entity.ReportItem;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.bi.VlifeReportItem;
import com.google.common.reflect.TypeToken;
import lombok.Data;

import static cn.wwwlike.vlife.objship.read.ItemReadTemplate.GSON;

/**
 * 报表视图
 */
@Data
public class ReportItemVo extends VlifeReportItem implements VoBean<ReportItem> {
    public String id;
    public Form form;

    /**
     * 项目名称
     */
    public String name;

    /**
     * 项目编码
     */
    public String code;
    /**
     * 聚合字段
     */
    public String fieldName;
    /**
     * 聚合方式
     */
    public String func;
    /**
     * 过滤条件
     */
    public String conditionJson;

    public Conditions getConditions() {
        if (getConditionJson() !=null) {
            Conditions condition = GSON.fromJson(getConditionJson(), new TypeToken<Conditions>() {
            }.getType());
            return condition;
        }
        return null;
    }
}
