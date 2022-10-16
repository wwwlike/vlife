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

package cn.wwwlike.sys.req;

import cn.wwwlike.sys.entity.SysOrg;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 机构查询条件
 */
@Data
public class SysOrgPageReq extends PageQuery<SysOrg> {
    /**
     * 机构名称/代码
     */
    @VField(opt = Opt.like,orReqFields = {"orgcode"})
    public String name;
    /**
     * 机构类型
     */
    public String type;

    //-----不同权限级别，对下面进行显示或者隐藏------------
    /**
     * 区划地区
     */
    @VField(opt = Opt.startsWith)
    public String sysArea_code;
    /**
     * 机构信息
     */
    @VField(opt = Opt.startsWith)
    public String code;

}
