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

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 用户详细信息
 */
@Data
public class UserDetailVo implements VoBean<SysUser> {
    public String id;
    /**
     * 用户名
     */
    public String name;
    /**
     * 账号
     */
    public String username;
    /**
     * 角色组名称
     */
    @VField(pathName = "sysGroup_name")
    public String groupName;

    /**
     * 用户有的权限资源代码
     */
    @VField(pathName = "sysGroup_sysRoleGroup_sysRole_sysResources_code")
    public List<String> resourceCodes;


    /**
     * menus
     */
    @VField(pathName = "sysGroup_sysRoleGroup_sysRole_sysResources_pcode")
    public List<String> menus;

}
