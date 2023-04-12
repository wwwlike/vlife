package cn.wwwlike.form.bean;

import cn.wwwlike.form.dto.PageComponentPropDto;
import lombok.Data;

import java.util.List;

@Data
public class IFrom {
    public String id;

    public String name;
    /**
     * 所属表单
     */
    public String formId;
    /**
     * 所在容器编码
     */
    public String formGroupCode;

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
     * 是否列表展示
     */
    public Boolean listShow;

    /**
     * 组件设置的JSON信息
     */
    public String componentSettingJson;

    public String getName() {
        return this.title;
    }

    /** 字段所在组件属性设置*/
    public List<PageComponentPropDto> pageComponentPropDtos;

}
