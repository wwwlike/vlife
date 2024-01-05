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

import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 用户角色
 */
@Data
@Entity
@Table(name = "sys_role")
@VClazz(clear = {SysResources.class,SysMenu.class})
public class SysRole  extends DbEntity {//clear 删除角色的同时 把sysresources和sysMenu表里的外键信息关联清除
   /**
    * 管理应用
    */
   public String sysMenuId;
   /**
    * 角色名称
    */
   public String name;
   /**
    * 描述介绍
    */
   public String remark;

}
