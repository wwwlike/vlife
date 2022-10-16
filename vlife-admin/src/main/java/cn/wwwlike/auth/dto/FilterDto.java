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

package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysFilter;
import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 查询权限主子表一起保存
 * @author xiaoyu
 * @date 2022/9/9
 */
@Data
public class FilterDto implements SaveBean<SysFilter> {
    public String id;
    /**
     * 模型名
     */
    public String entityName;
    /**
     * 模型中文名
     */
    public String name;
    /**
     * 是否业务模型
     */
    public Boolean busniess;

    public List<SysFilterDetail> details;
}
