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

package cn.wwwlike.auth.req;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 用户列表查询
 */
@Data
public class SysUserPageReq extends PageQuery<SysUser> {
    /**
     * 姓名/手机/证件
     */
    @VField(pathName = "name",opt = Opt.like,orReqFields = {"tel","idno"})
    public String search;

    public String state;
    /**
     * 用户类型
     */
    public String usetype;
    /**
     * 权限组
     */
    public String sysGroupId;
    /**
     * 机构
     */
//    @VField(opt = Opt.startsWith)
//    public String sysOrg_code;
    /**
     * 部门
     */
    public String sysDept_code;
}
