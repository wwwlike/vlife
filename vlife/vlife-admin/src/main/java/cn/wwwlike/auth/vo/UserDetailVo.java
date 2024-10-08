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

import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 用户详细信息
 */
@Data
public class  UserDetailVo implements VoBean<SysUser> {
    public String id;
    /**
     * 头像
     */
    public String avatar;
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

    public String userType;

    public SysDept sysDept;

    /**
     * 用户有的权限资源代码 权限组->角色权限->角色->资源——资源编码
     */
    @VField(pathName = "sysGroup_sysGroupResources_sysResources_code")
    public List<String> resourceCodes;

    /**
     * 机构名称
     */
//    public String sysOrg_name;

    /**
     * 地区名称
     */
//    public String sysOrg_sysArea_name;

    /**
     * 地区编码
     */
    //public String sysOrg_sysArea_areacode;

    /**
     * 地区id
     */
    //@VField(pathName = "sysOrg_sysAreaId")
    //public String sysAreaId;

    /**
     * 地区编码
     */
   // @VField(pathName = "sysOrg_sysArea_code")
    //public String codeArea;

    /**
     * 部门代码
     */
    @VField(pathName = "sysDept_code")
    public String codeDept;

    /**
     * 机构代码
     */
//    @VField(pathName = "sysOrg_code")
//    public String codeOrg;

    /**
     * 机构id
     */
//    public String sysOrgId;

    /**
     * 权限组名称
     */
    @VField(pathName = "sysGroup_name")
    public String groupName;

    /**
     * 行级数据权限
     */
    @VField(pathName = "sysGroup_filterType")
    public String groupFilterType;

    /**
     * 权限组
     */
    public String sysGroupId;

    /**
     * 用户能够访问到的所有菜单信息
     */
    @VField(skip = true)
    public List<MenuVo> menus;

    public  Boolean superUser;

    //用户状态
    public String state;


}
