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

package cn.wwwlike.sys.vo;

import cn.wwwlike.sys.entity.SysArea;
import cn.wwwlike.sys.entity.SysOrg;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/8/22
 */
@Data
public class OrgVo implements VoBean<SysOrg> {
    public String id;
    public String name;
}
