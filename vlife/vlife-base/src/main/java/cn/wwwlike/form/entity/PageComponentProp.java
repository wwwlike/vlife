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
public class PageComponentProp extends DbEntity {
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
     * 接口数据适配
     * match->func-key
     */
    public String relateVal;
    /***
     * 数据过滤
     * 多个过滤器之间用逗号隔开，字段与字段值之间用冒号隔开
     * [type:eee,ageFunc] 表示使用查询type=eee和ageFunc函数进行数据过过滤
     */
    public String filterFunc;
    /**
     * 过滤条件的连接方式
     * and/or
     */
    public String filterConnectionType;

    // plus

    /***
     * 所属组件
     */
    public String pageComponentId;
}
