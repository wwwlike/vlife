package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 模型字段信息
 * 也包含UI场景的配置信息
 */
@Entity
@Data
@Table(name = "form_field")
@VClazz(orders = "sort_asc",remove = {FormReaction.class})
public class FormField extends DbEntity {
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

    /**
     * 字段名
     */
    public String fieldName;
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
     *  唯一不重复
     * validate是内置远程校验规则，触发form内部远程数据校验
     */
    public boolean  validate_unique;
    /**
     * 新增时隐藏
     */
    public boolean  create_hide;
    /**
     * 修改时只读
     * 不可修改
     */
    public boolean  modify_read;
    /**
     * 分组
     */
    public boolean divider;
    /**
     * 分组名称
     */
    public String dividerLabel;
    /**
     * 所在分组
     * 不存id原因，设计器阶段还没有产生id
     */
    public String formGroupCode;
    /**
     * 所在页签编码
     */
    public String formTabCode;
    /**
     * 标签隐藏
     */
    public boolean hideLabel;
    /**
     * 产生来源所在实体名称
     */
    public String entityType;
    /**
     * 字段来源实体对应字段名
     */
    public String entityFieldName;

    //组件类型
    public String componentType;

    /**
     * 全路径
     */
    public String pathName;
    /**
     * 字典的code
     */
    public String dictCode;

    //-----------formily 场景字段配置的信息

    /**
     * formliy里的字段名称，默认一致
     */
    public String dataIndex;

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

    /**
     * 组件设置的JSON信息
     * 没有用到
     */
    public String componentSettingJson;

    // -------------------- 列表方面的设置 ---------------------
    /**
     * 列排序
     */
    public Integer listSort;
    /**
     * 列隐藏
     */
    public Boolean listHide;
    /**
     * 列宽
     */
    public Integer listWidth;
    /**
     * 是否金额
     * 格式化，数值型使用
     */
    public Boolean money;
    /**
     * 对齐方式
     * center|left|right
     */
    @VField(dictCode = "COLUMN_ALGIN")
    public String listAlign;

    /**
     * 列搜索
     * 放入统配搜若条件里
     */
    public boolean listSearch;

    /**
     * 数据库字段长度
     */
    public int dbLength;
    /**
     * 字符加密
     */
    public boolean safeStr;

    /**
     * 导入导出
     */
    public Boolean excel;
}
