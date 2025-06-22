package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 模型字段信息
 */
@Entity
@Data
@Table(name = "form_field")
//级联删除
@VClazz(orders = "sort_asc",remove = {SysDict.class,PageComponentProp.class,FormNo.class,ButtonField.class,FormReaction.class})
public class FormField extends DbEntity {
    /**
     *  所属模型
     */
    public String formId;
    /**
     * 字段标识
     */
    public String fieldName;
    /**
     * 字段名
     */
    public String title;
    /**
     * 字段类别
     * basic,array,object
     */
    public String dataType;
    /**
     * 字段类型
     * ts类型
     */
    public String fieldType;
    /**
     * java类型
     */
    public String javaType;
    /**
     * 系统字段
     */
    public Boolean sysField;
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
     */
    public boolean  modify_read;
    /**
     * 标签隐藏
     */
    public boolean hideLabel;
    /**
     * 字段值实际来源实体名称
     * 如:sysUser的sysDeptId外键创建在user表里，但是实际数据来自sysDept
     */
    public String entityType;
    /**
     * 字段来源实体对应字段名
     */
    public String entityFieldName;
    /**
     * 全路径
     */
    public String pathName;
    /**
     * 字典的code
     */
    public String dictCode;
    /**
     * 数据库字段长度
     */
    public Integer dbLength;
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
     * 描述
     */
    public String description;
    /**
     * 采用组件
     */
    public String x_component;
    //显示状态
    public String x_display;
    /**
     * 只读
     */
    public boolean x_disabled;
    /**
     * 顺序
     */
    public Integer sort;
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
    /**
     * 禁用
     */
    public Boolean disabled;
    /**
     * 只读
     */
    public Boolean readOnly;
    //-------------外观
    /**
     * 包裹组件
     */
    public String x_decorator;
    /**
     * 只读
     *
     */
    public Boolean x_read_pretty;
    //待移除
    /**
     * 分组
     */
    public boolean divider;
    /**
     * 分组名称
     */
    public String dividerLabel;
//
//    public FormField(String formId,String entityType,String fieldName,String title,String javaType,boolean sysField){
//        this.entityType=entityType;
//        this.fieldName=fieldName;
//        this.formId=formId;
//        this.title=title;
//        this.javaType=javaType;
//        this.sysField=sysField;
//    }
//
//    public FormField(){}
}
