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
import cn.wwwlike.vlife.base.IFilter;
import cn.wwwlike.vlife.base.IUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.IFkItem;
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
public class SysUser extends DbEntity implements IFkItem,IUser, IFilter {
    /**
     * 用户名
     */
    public String username;
    /**
     * 姓名
     */
    public String name;
    /**
     * 部门
     */
    public String sysDeptId;
    /**
     * 权限组
     * 为用户分配权限组，权限组关联到多个角色
     */
    public String sysGroupId ;
    /**
     * 邮箱
     */
    public String email;
    /**
     * 电话
     */
    public String tel;
    /**
     * 证件号
     * 请填写18位身份证号码
     */
    public String idno;
    /**
     * 年龄
     */
    public Integer age;
    /**
     * 用户类型
     */
    @VField(dictCode = "USER_TYPE")
    public String usetype;
    /**
     * 头像
     */
    public String avatar;
    /**
     * 启用状态
     */
    @VField(dictCode = "STATE")
    public String state;
    /**
     * 登录次数
     */
    public Integer loginNum;
    /**
     * 用户来源
     * gitee register
     */
    public String source;
    /**
     * 第三方id
     */
    public String thirdId;
    /**
     * 第三方的token
     */
    public String thirdToken;
    /**
     * 超级用户
     */
    public Boolean superUser;
    /**
     * 密码
     */
    public String password;

}
