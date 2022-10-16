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

import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 查询配置明细展示
 * @author xiaoyu
 * @date 2022/9/16
 */
@Data
public class SysFilterDetailVo implements VoBean<SysFilterDetail> {
    public String id;
    public String sysFilterId;
//    public String fieldName;
    public String name;
    public Integer scope;
    public String sysFilter_entityName;
    public String sysFilter_name;
    public Boolean sysFilter_busniess;
}
