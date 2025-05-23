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

package cn.wwwlike.sys.dto;
import cn.vlife.common.IField;
import cn.vlife.utils.FormRuleUtils;
import cn.wwwlike.sys.entity.FormField;
import cn.wwwlike.sys.entity.FormNo;
import cn.wwwlike.sys.entity.FormReaction;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 字段信息视图
 */
@Data
public class FormFieldDto  extends SaveBean<FormField> implements IField {
    public FormFieldDto(){};
    public FormFieldDto(String entityType,String fieldName,String title,String javaType,boolean sysField){
        this.entityType=entityType;
        this.fieldName=fieldName;
        this.title=title;
        this.javaType=javaType;
        this.sysField=sysField;
    }
    public String title;
//    public String javaTitle;
    public String entityType;
    public String entityFieldName;
    public String fieldName;
    public String pathName;
    public boolean hideLabel;
    public String dictCode;
    public Boolean sysField;
    public String formId;
    public Integer dbLength;
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
     * java类型
     * 简单类型存类名|包装类型存包名+类名|text是特例
     */
    public String javaType;
    public boolean  create_hide;
    public boolean  modify_read;
    public boolean x_disabled;
    //-----------formily字段
    /**
     * formliy里的字段名称，默认一致
     */
    public String dataIndex;
    /**
     *  唯一不重复
     * validate是内置远程校验规则，触发form内部远程数据校验
     */
    public boolean  validate_unique;
    /**
     * 默认值
     */
    public String initialValues;
    /**
     * 必填
     */
    public boolean required;
    //显示状态2
    public String x_display;
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
     */
    public Boolean x_read_pretty;
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
     * label位置 水平 vertical
     */
    public String x_decorator_props$layout;
    /**
     * label位置 对齐 left
     */
    public String x_decorator_props$labelAlign;
    /**
     * 描述信息
     */
    public String x_component_props$placeholder;
    /**
     * 最小长度
     */
    public Integer minLength;
    /**
     * 最大长度
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
    /** 字段属性配置 */
    public List<PageComponentPropDto> pageComponentPropDtos;
    /** 组件联动配置 */
    public List<FormReaction> formReactions;
    /** 序号生成策略配置 */
    public List<FormNo> formNos;

    @VField(skip = true)
    public List<String> vf;

    //待移除
    /**
     * 分割线标签名称
     */
    public String dividerLabel;
    /**
     * 加入分割线
     */
    public boolean divider;

    public List<String> getVf(){
        if(this.getFormReactions()!=null){
            return this.getFormReactions().stream().map(d-> FormRuleUtils.toVfEl(d)).collect(Collectors.toList());
        }
        return null;
    }
}
