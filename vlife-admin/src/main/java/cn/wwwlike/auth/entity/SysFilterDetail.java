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
 * 查询配置明细
 * 记录个模块可参数行数据过滤的选项(groupFilterDto里进行选择)
 */
@Data
@Table(name = "sys_filter_detail")
@Entity
public class SysFilterDetail extends DbEntity {
    /**
     * 模块
     */
    public String sysFilterId;
    /**
     * 数据范围
     */
    @VField(dictCode = "GROUP_SCOPE")
    public Integer scope;
    /**
     * map的key
     */
    public String fieldKey;
    /**
     * 是否是查询本级和下级
     */
    public Boolean querySub;

    /**
     * 查询的是否是当前自己本表
     */
    public Boolean querySelf;

    public String name;


}
