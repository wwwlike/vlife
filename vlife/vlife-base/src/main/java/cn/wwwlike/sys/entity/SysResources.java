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


import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 权限资源
 */
@Data
@Entity
@Table
public class SysResources extends DbEntity{
    /**
     * 资源名称
     */
    public String name;
    /**
     * 接口说明
     * 把接口的第二行非@开头的字符串放在remark里；
     * 没有则使用模块+name进行设置
     */
    public String remark;

    /**
     * 接口地址
     */
    public String url;
    /**
     * 实体标识
     * 弃用，采用formId进行外键关联
     */
    @VField(expire = true)
    public String entityType;
    /**
     *  所属模型
     */
    public String formId;
    /**
     * apiCLass
     */
    public String actionType;
    /**
     * 权限code
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
     * 主要接口
     * 作为访问菜单的必备接口，拥有菜单下任意资源的角色都能拥有该资源的权限
     */
    public boolean menuRequired;
    /**
     * 启用状态
     * 1 是 -1 待纳入
     *  1则可以和菜单关联显示出来，进而让角色关联
     */
    @VField(dictCode = "STATE")
    public String state;
    /**
     * 归属角色
     * 参与权限管理的角色 state=1才能进行关联
     */
    public String sysRoleId;
    /**
     * 上级资源
     * 依赖资源，当前未启用
     */
    public String pcode;

}
