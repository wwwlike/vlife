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

package cn.wwwlike.sys.entity;

import cn.wwwlike.auth.common.IArea;
import cn.wwwlike.auth.common.IBus;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 机构
 */
@Data
@Entity
@Table(name = "sys_org")
public class SysOrg extends DbEntity implements ITree, IBus {
    /**
     * 机构名称
     */
    public String name;
    /**
     * 组织机构代码
     */
    public String orgcode;
    /**
     * 编码
     */
    public String code;
    /**
     * 上级机构
     */
    public String pcode;
    /**
     * 机构分类
     */
    @VField(dictCode = "ORG_TYPE")
    public String type;
    /**
     * 地区
     */
    public String sysAreaId;
    /**
     * 启用日期
     */
    public Date enableDate;

}
