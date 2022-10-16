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

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 查询配置
 * 子类如果是规则表(当前是地区，机构，科室他们都是树型)按ID和code过滤
 * 业务表按照规则表（sysArea,sysDept,sysOrg）的id过滤，或者连接则表后根据规则表的code过滤
 */
@Table(name = "sys_filter")
@Entity
@Data
public class SysFilter extends DbEntity {
    /**
     * 编码
     */
    public String entityName;

    /**
     * 名称
     */
    public String name;

    /**
     * 是否业务模型
     */
    public Boolean busniess;
}
