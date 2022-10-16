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

package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.FormEvent;
import cn.wwwlike.form.entity.FormReaction;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.objship.dto.SaveDto;
import lombok.Data;

import java.util.List;

/**
 * 字段事件响应表单
 */
@Data
public class FormEventDto implements SaveBean<FormEvent> {
    public String id;
    public String formId;
    /**
     * 事件名称
     */
    public String name;
    /**
     * 事件字段
     */
    public String formFieldId;

    /**
     * 事件属性
     */
    public String attr;
    /**
     * 匹配类型
     */
    public String eventType;
    /**
     * 匹配值
     */
    public String val;

    /**
     * 响应内容
     */
    List<FormReaction> reactions;


}
