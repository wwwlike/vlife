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

package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.ReportTable;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 报表及关联统计项和指标传输的dto
 */
@Data
public class ReportTableDto implements SaveBean<ReportTable> {
    public String id;
    public String name;
    public String code;
    public String groupColumn;
    public String func;
    @VField(pathName = "reportTableItem_reportItemId")
    public List<String> itemIds;
    @VField(pathName = "reportTableItem_reportKpiId")
    public List<String> kpiIds;
}