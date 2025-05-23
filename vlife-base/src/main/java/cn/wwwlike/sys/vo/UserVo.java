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

import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 用户列表信息
 */
@Data
public class UserVo extends VoBean<SysUser> {
    /**
     * 头像
     */
    public String avatar;
    /**
     * 用户名
     */
    public String name;
    /**
     * 账号
     */
    public String username;
    /**
     * 证件号码
     */
    public String idno;
    /**
     * 联系电话
     */
    public String tel;
    /**
     * 用户类型
     */
    public String userType;

    public String state;


}
