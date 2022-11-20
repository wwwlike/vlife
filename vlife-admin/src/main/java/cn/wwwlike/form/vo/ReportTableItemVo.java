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

package cn.wwwlike.form.vo;

import cn.wwwlike.form.entity.ReportItem;
import cn.wwwlike.form.entity.ReportKpi;
import cn.wwwlike.form.entity.ReportTableItem;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 报表明细项视图
 */
@Data
public class ReportTableItemVo implements VoBean<ReportTableItem> {
    public String id;
    public Integer sort;
    /**
     * 指标
     */
    public ReportKpi kpi;
    /**
     * 统计项
     */
    public ReportItem item;


}
