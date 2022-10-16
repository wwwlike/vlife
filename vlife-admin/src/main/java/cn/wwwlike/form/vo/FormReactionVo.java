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

package cn.wwwlike.form.vo;

import cn.wwwlike.form.dto.FormEventDto;
import cn.wwwlike.form.entity.FormReaction;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 响应信息VO
 */
@Data
public class FormReactionVo implements VoBean<FormReaction> {
    public String id;
    /**
     * 触发事件
     */
    public String formEventId;
    /**
     * 响应字段
     */
    public String formFieldId;

    @VField(pathName = "formField_fieldName")
    public String fieldName;
    /**
     * 响应属性
     */
    public String reactionAttr;
    /**
     * 响应值
     */
    public String reactionValue;
//
//    //触发信息 外键表字段打平
//    /**
//     * 触发的字段
//     */
//    @VField(pathName = "formEvent_formField_fieldName")
//    public String depsFieldName;
//
//
//    /**
//     * 触发的字段
//     */
//    @VField(pathName = "formEvent_attr")
//    public String deptsAttr;
//
//    /**
//     * 触发原因
//     */
//    @VField(pathName = "formEvent_eventType")
//    public String depsEventType;
//    /**
//     * 触发值域
//     */
//    @VField(pathName = "formEvent_val")
//    public String depsVal;

}
