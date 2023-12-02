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
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 字段信息视图
 */
@Data
public class FormFieldDto  implements SaveBean<FormField> {

    public String id;

    /**
     * 标题
     * db标题
     */
    public String title;
    /**
     * 标题
     * java标题
     */
    public String javaTitle;

    public boolean hideLabel;

    /**
     * 前端数据类型
     * basic,array,object
     */
    public String dataType;
    /**
     * 字段类型
     */
    public String fieldType;

    /**
     * 所属表单
     */
    public String formId;
    /**
     * 所在分组code
     */
    public String formGroupCode;

    /**
     * 所在页签code
     */
    public String formTabCode;

    //真实字段所在实体名称
    public String entityType;

    //实体字段名称
    public String entityFieldName;


    //组件类型
    public String componentType;
    /**
     * 字段名
     */
    public String fieldName;
    /**
     * 全路径
     */
    public String pathName;

    /**
     * 字典的coden
     */
    public String dictCode;


    //-----------formily

    /**
     * formliy里的字段名称，默认一致
     */
    public String dataIndex;

    /**
     *  唯一不重复
     * validate是内置远程校验规则，触发form内部远程数据校验
     */
    public boolean  validate_unique;

    public boolean  create_hide;

    /**
     * 修改时只读
     * 不可修改
     */
    public boolean  modify_read;


    /**
     * 加入分割线
     */
    public boolean divider;
    /**
     * 分割线标签名称
     */
    public String dividerLabel;

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
     * 只读
     *
     */
    public Boolean x_read_pretty;

    /**
     * 禁用
     * 删除
     */
    public Boolean disabled;
    /**
     * 只读
     * 删除
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
     * vlife开头 需要特殊处理的字段
     */
    public String vlife_pattern;

    public String vlife_message;

    /**
     * 对应 x-decorator-props.gridSpan属性
     */
    public Integer x_decorator_props$gridSpan;

    /**
     * label位置 水平 vertical
     */
    public String x_decorator_props$layout;

    /**
     * label位置 对齐 left
     */
    public String x_decorator_props$labelAlign;


    /**
     * 描述信息 对应 x-component-props.placeholder;
     */
    public String x_component_props$placeholder;
    /**
     * 加载组件数据的地址关键字
     */
    public String apiKey;
    /**
     * 字段校验方式
     */
    public String x_validator;

    /**
     * 组件设置的JSON信息
     */
    public String componentSettingJson;

    /**
     * 最小长度
     */
    public Integer minLength;
    /**
     * 最小长度
     */
    public Integer maxLength;

    /**
     * 最小值
     */
    public Double minimum;
    /**
     * 最大值
     */
    public  Double maximum;

    /** 字段所在组件属性设置*/
    public List<PageComponentPropDto> pageComponentPropDtos;


    /**
     * 列排序
     */
    public Integer listSort;

    /**
     * 是否列表展示
     */
    public Boolean listHide;
    /**
     * 列宽
     */
    public Integer listWidth;
    /**
     * 是否金额
     */
    public Boolean money;
    /**
     * 列表对其方式
     */
    public String listAlign;
    /**
     * 字符串加密
     */
    public boolean safeStr;
    /**
     * 列搜索
     */
    public boolean listSearch;

}
