package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 组件属性
 */
@Entity
@Data
@Table(name="page_component_prop")
@VClazz(module = "conf")
public class PageComponentProp extends DbEntity {
    /***
     * 所属组件
     */
    public String pageComponentId;

    /**
     * 关联字段
     * FormField里选择x_component后，其属性信息在本表里存储
     */
    public String formFieldId;

    /**
     * 属性名称
     */
    public String propName;


    /**
     * 子属性名称
     */
    public String subName;

    /**
     * 数组排序号
     */
    public Integer listNo;
    /**
     * 属性值来源
     * 系统值/常量值/对象字段取值/接口取值
     * (最终会去掉，所有组件属性来源在定义组件时需要确定唯一性，减少复杂度，让维护人员更方便)
     */
    public String sourceType;
    /**
     * 属性值
     */
    public String propVal;

    /**
     * 关联值
     * 选择接口，如果有的接口需要转换，有多种昂转换选择，则可以利用该字段
     */
    public String relateVal;

    /**
     * 接口取值到属性值的转换方法名称
     */
    public String apiMethod;

}
