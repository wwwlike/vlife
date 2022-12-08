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

package cn.wwwlike.oa.vo;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.sys.entity.SysOrg;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 用户明细信息
 */
@Data
public class UserInfo implements VoBean<SysUser> {
    public String id;
    public String name;

    public String avatar;

    /**
     * 角色组名称
     */
    public String sysGroupName;
    /**
     * 关联负责项目的甲方
     */
    public List<SysOrg> project_sysOrg;

    public List<String> project_sysOrg_name;

    /**
     * 角色组关联的角色名称
     */
    public List<String> sysGroup_sysRoleGroup_sysRole_name;
}
