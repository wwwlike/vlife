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
 * 表单响应
 *
 * 记录和formField
 */
@Entity
@Data
@Table(name="form_reaction")
@VClazz(module = "conf")
public class FormReaction extends DbEntity {
    /**
     * 触发事件
     */
    public String formEventId;
    /**
     * 响应字段
     */
    public String formFieldId;
    /**
     * 响应属性
     */
    public String reactionAttr;
    /**
     * 响应值
     */
    public String reactionValue;
    /**
     * 初始值
     */
    public String initValue;
}
