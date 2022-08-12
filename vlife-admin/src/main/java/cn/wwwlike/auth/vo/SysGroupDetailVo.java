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

import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 角色组详情
 */
@Data
public class SysGroupDetailVo implements VoBean<SysGroup> {
    /**
     * 组id
     */
    public String id;
    /**
     * 组名称
     */
    public String name;
    /**
     * 组说明
     */
    public String remark;


    public List<String> sysRoleGroup_sysRole_name;

//    @VField(pathName = "sysRoleGroup_sysRole")
//    public List<SysRole> roleList;


}
