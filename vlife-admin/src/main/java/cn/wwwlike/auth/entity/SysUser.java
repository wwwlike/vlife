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

package cn.wwwlike.auth.entity;

import cn.wwwlike.auth.common.IDept;
import cn.wwwlike.auth.common.IOrg;
import cn.wwwlike.base.model.IUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 用户表
 */
@Data
@Entity
@Table(name = "sys_user")
public class SysUser extends DbEntity implements IUser, IOrg {
    /**
     * 头像
     */
    public String avatar;
    /**
     * 姓名
     */
    public String name;
    /**
     * 用户名
     */
    public String username;
    /**
     * 密码
     */
    public String password;
    /**
     * 权限组
     */
    public String sysGroupId ;
    /**
     * 证件号
     */
    public String idno;
    /**
     * 电话
     */
    public String tel;
    /**
     * 用户类型
     */
    @VField(dictCode = "USER_TYPE")
    public String usetype;
    /**
     * 启用状态
     */
    @VField(dictCode = "STATE")
    public String state;

    /**
     * 单位
     */
    public String sysOrgId;

    /**
     * 部门
     */
    public String sysDeptId;

    /**
     * 登录次数
     */
    public Integer loginNum;

    /**
     * 用户来源
     */
    public String source;

}
