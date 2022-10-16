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

import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/7/12
 */

/**
 * 角色dto
 * roleDto直观接收数据，
 * vo管编辑页面数据展示
 */
@Data
public class RoleDto implements SaveBean<SysRole> {
    public String id;
    public String name;
    public String remark;
    /**
     * 绑定权限资源
     */
    public List<String> sysResources_id;
}
