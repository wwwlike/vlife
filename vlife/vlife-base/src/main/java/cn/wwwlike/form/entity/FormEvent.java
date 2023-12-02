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

package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 *  触发事件
 */
@Entity
@Data
@Table(name="form_event")
@VClazz(module = "conf")
public class FormEvent extends DbEntity {
    /** [name] =当[formId]表[formFieldId]字段
     * [attr]属性[eventType][val]匹配事件
     * 触发事件
    ***/

    /**
     * 所属表单
     */
    public String formId;
    /**
     * 依赖字段
     * 下面这个字段要转到多对多的表，做成多个字段值域变化影响相关字段的响应
     * 还需要做成，根据系统变量，或者其他表的字段的变量.如用户查询权限，操作权限
     */
    public String formFieldId;
    /**
     * 事件名称
     */
    public String name;

    /**
     * 触发时机
     * 1.实时
     * 2.进入时
     */
    public String moment;

    /**
     * 字段的属性
     */
    public String attr;
    /**
     * 触发的事件类型
     */
    public String eventType;
    /**
     * 匹配的值
     * 多个中间用逗号分隔
     */
    public String val;

    /**
     * 是否系统自动产生的
     * 快捷方式产生的事件在手工列表则不展示；新增时隐藏属于系统创建的
     */
    public boolean sys;
}
