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
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.plus.report.entity.ReportTable;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 报表配置视图
 */
@Data
public class ReportTableVo implements VoBean<ReportTable> {
    public String id;
    public String name;
    public String code;
    public String func;
    public String groupColumn;
    /**
     * 实体模型
     */
    public FormVo formVo;
    /**
     * 报表项目
     */
    public List<ReportTableItemVo> items;
}