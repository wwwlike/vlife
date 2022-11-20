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

import cn.wwwlike.form.entity.ReportKpi;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ReportKpiCompVo implements VoBean<ReportKpi> {
    @VField(pathName = "name")
    public String label;
    @JsonProperty("value")
    public String id;
}
