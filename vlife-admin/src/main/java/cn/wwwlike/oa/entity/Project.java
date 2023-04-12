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

package cn.wwwlike.oa.entity;

import cn.wwwlike.auth.common.Business;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 项目管理
 *
 * @author xiaoyu
 * @date 2022/8/17
 */
@Data
@Entity
@Table(name = "oa_project")
@VClazz(module = "oa")
public class Project extends DbEntity implements Business {
    /**
     * 项目名称
     */
    public String name;
    /**
     * 项目编号
     */
    public String projectNo;
    /**
     * 项目说明
     */
    public String projectRemark;
    /**
     * 甲方
     */
    public String customer;
    /**
     * 负责人
     */
    public String sysUserId;
    /**
     * 项目阶段
     */
    @VField(dictCode = "PROJECT_STATE")
    public String state;
    /**
     * 启动日期
     */
    public Date startDate;
    /**
     * 数据机构
     */
    public String sysOrgId;
    /**
     * 数据地区
     */
    public String sysAreaId;
    /**
     * 数据部门
     */
    public String sysDeptId;

    /**
     * 合同金额
     */
    public Double amount;
}
