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
import cn.wwwlike.sys.entity.SysArea;
import cn.wwwlike.sys.vo.AreaVo;
import cn.wwwlike.sys.vo.OrgVo;
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
     * 部门id
     */
    public String sysDeptId;

    /**
     * 账号
     */
    public String username;

    /**
     * 机构名称
     */
    public String sysOrg_name;

    /**
     * 地区名称
     */
    public String sysOrg_sysArea_name;

    /**
     * 地区编码
     */
    public String sysOrg_sysArea_areacode;

    /**
     * 地区id
     */
    @VField(pathName = "sysOrg_sysAreaId")
    public String sysAreaId;

    /**
     * 地区编码
     */
    @VField(pathName = "sysOrg_sysArea_code")
    public String codeArea;

    /**
     * 部门代码
     */
    @VField(pathName = "sysDept_code")
    public String codeDept;

    /**
     * 机构代码
     */
    @VField(pathName = "sysOrg_code")
    public String codeOrg;

    /**
     * 机构id
     */
    public String sysOrgId;

    /**
     * 权限组名称
     */
    @VField(pathName = "sysGroup_name")
    public String groupName;

    /**
     * 用户有的权限资源代码 权限组->角色权限->角色->资源——资源编码
     */
    @VField(pathName = "sysGroup_sysRoleGroup_sysRole_sysResources_resourcesCode")
    public List<String> resourceCodes;

    /**
     * 角色里资源对应的菜单
     */
    @VField(pathName = "sysGroup_sysRoleGroup_sysRole_sysResources_menuCode")
    public List<String> menus;

}
