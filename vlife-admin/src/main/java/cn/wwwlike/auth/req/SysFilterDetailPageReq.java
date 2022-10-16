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

package cn.wwwlike.auth.req;

import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 过滤条件
 */
@Data
public class SysFilterDetailPageReq extends PageQuery<SysFilterDetail> {
    /**
     * 模块
     */
    public String sysFilterId;

    public Boolean sysFilter_busniess;
//    /**
//     * 启用状态
//     */
//    public String state;


}
