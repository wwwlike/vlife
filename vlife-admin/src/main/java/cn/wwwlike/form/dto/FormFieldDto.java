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

import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 字段信息视图
 */
@Data
public class FormFieldDto implements VoBean<FormField> {
    public String id;
    /**
     * 所属表单
     */
    public String formId;
    /**
     * 分组容器
     */
    public String formGroupId;
    /**
     * 字段名
     */
    public String fieldName;
    /**
     * 全路径
     */
    public String pathName;
    /**
     * 字段类型
     */
    public String fieldType;

    /**
     * 字典的coden
     */
    public String dictCode;

    /**
     * 元素类型
     */
    public String type;

    //-----------formily

    /**
     * formliy里的字段名称，默认一致
     */
    public String dataIndex;
    /**
     * 标题
     */
    public String title;
    /**
     * 默认值
     */
    public String initialValues;
    /**
     * 必填
     */
    public boolean required;
    /**
     * 隐藏
     */
    public boolean x_hidden;

    /**
     * 描述
     */
    public String description;
    /**
     * 采用组件
     */
    public String x_component;
    /**
     * 禁用
     */
    public Boolean disabled;
    /**
     * 只读
     */
    public Boolean readOnly;
    /**
     * 顺序
     */
    public Integer sort;

    //-------------外观
    /**
     * 包裹组件
     */
    public String x_decorator;

    /**
     * 对应 x-decorator-props.gridSpan属性
     */
    public Integer x_decorator_props$gridSpan;

    /**
     * 异步加载数据的api的name
     */
    public String apiKey;

    /**
     * 字段校验方式
     */
    public String x_validator;


    /**
     * label位置 水平 vertical
     */
    public String x_decorator_props$layout;

    /**
     * label位置 对齐 left
     */
    public String x_decorator_props$labelAlign;


    public String vlife_pattern;
    public String vlife_message;
}
