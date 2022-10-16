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

package cn.wwwlike.auth.vo;

import cn.wwwlike.auth.entity.SysFilter;
import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 过滤配置主表视图
 */
@Data
public class SysFilterVo implements VoBean<SysFilter> {
    public String id;
    public String name;
    public String entityName;
    public Boolean busniess;
    public List<SysFilterDetail> details;
    public List<FilterDetailCompVo> detailList;
}
