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

import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 字段信息vo
 */
@Data
@VClazz(orders = "sort_asc")
public class FormFieldVo implements VoBean<FormField> {
    public String id;
    /**
     * 所属表单
     */
    public String formId;

    //真实字段所在实体名称
    public String entityType;

    //实体字段名称
    public String entityFieldName;

    //组件类型
    public String componentType;

    /**
     * 分组容器编码
     */
    public String formGroupCode;
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

//    /**
//     * 响应内容
//     */
//    public List<FormReactionVo> reactions;

    /**
     * 自己触发的事件
     */
    public List<FormEventVo> events;

    public Integer x_decorator_props$gridSpan;
    /**
     * 填写描述信息
     */
    public String x_component_props$placeholder;

    /**
     * label位置 水平 vertical
     */
    public String x_decorator_props$layout;

    /**
     * label位置 对齐 left
     */
    public String x_decorator_props$labelAlign;

    /**
     * 加载组件数据的地址
     */
    public String apiKey;
    /**
     * 字段校验方式
     */
    public String x_validator;
    /**
     * 校验正则表达式
     */
    public String vlife_pattern;
    /**
     * 正则自定义提醒
     */
    public String vlife_message;

    /**
     * 是否列表展示
     */
    public Boolean listShow;

    /**
     * 预览
     */
    public String componentSettingJson;
}
