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
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 权限资源
 */
@Data
@Entity
@Table(name = "sys_reources")
public class SysResources  extends DbEntity{
    /**
     * 资源名称
     */
    public String name;
    /**
     * 接口地址
     */
    public String url;

    /**
     * 所属模块类型
     */
    public String entityType;

    /**
     * 所在api的类标识
     */
    public String actionType;

    /**
     * 资源编码
     * 接口进行转换
     */
    public String code;
    /**
     * 图标
     */
    public String icon;

    /**
     * 归属菜单
     * 归属就开启了权限
     */
    public String sysMenuId;

    /**
     * 菜单必备资源
     */
    public boolean menuRequired;

    /**
     * 是否需要权限管理
     * 1 是
     * 0 不是
     * -1 待处理
     */
    public String state;
    /**
     * 归属角色
     * 参与权限管理的角色，auth=true时选择
     */
    public String sysRoleId;
    /**
     * 上级资源
     */
    public String pcode;
    /**
     * 接口说明
     */
    public String remark;

}
