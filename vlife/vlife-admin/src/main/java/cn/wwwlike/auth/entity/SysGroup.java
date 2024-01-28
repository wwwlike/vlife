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
 * 权限组
 */
@Data
@Entity
@Table(name = "sys_group")
public class SysGroup extends DbEntity {
   /**
    * 权限组名称
    */
   public String name;
   /**
    * 描述
    */
   public String remark;
   /**
    * 数据维度
    * 行级数据过滤层级选择，在sysUser里的外键表都可以作为数据维度
    */
   @VField(dictCode = "GROUP_FILTER_TYPE")
   public String filterType;

}
