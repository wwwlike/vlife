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
import cn.wwwlike.sys.entity.SysGroup;
import cn.wwwlike.sys.entity.SysMenu;
import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;
import java.util.Set;

/**
 * 用户详细信息
 */
@Data
public class  UserDetailVo extends VoBean<SysUser> {
    //姓名
    public String name;
    //账号
    public String username;
    //头像
    public String avatar;
    //部门
    public String sysDeptId;
    //用户类型(职位)
    public String userType;
    //部门编码
    @VField(pathName = "sysDept_code")
    public String codeDept;
    //权限组
    public List<SysGroup> sysUserGroup_sysGroup;
//    //权限组
//    public List<String> sysUserGroup_sysGroupId;
//    //所有权限组的查询级别
//    public List<String> sysUserGroup_sysGroup_defaultLevel;
    //是否超级管理员
    public  Boolean superUser;
    //用户状态
    public String state;
    //部门
    public SysDept sysDept;
    //可用菜单
    @VField(skip = true)
    public List<SysMenu> menus;
    //数据层级
    @VField(skip = true)
    public String defaultLevel;
    /**
     * 可用视图
     * 未启用
     */
    @VField(skip = true)
    public Set<String> tabIds;
    /**
     * 按钮id集合
     * (待加入)
     */
    @VField(skip = true)
    public Set<String> btnIds;

}
