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

import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/9/22
 */
@Data
public class FormDto implements SaveBean<Form> {
    public String id;
    /**
     * 元素中文信息
     */
    public String title;
    /**
     * 类型(clz)
     */
    public String type;
    /**
     * 实体clz
     */
    public String entityType;
    /**
     * ui类型
     */
    public String uiType;
    /**
     * 模型类型
     */
    public String itemType;


    public String name;

    public Integer gridSpan;

    public List<FormField> fields;

}
