package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 组件属性
 */
@Entity
@Setter
@Table(name="page_component_prop")
public class PageComponentProp extends DbEntity {
    /**
     * 关联字段
     * 有值则表示作为表单设计器的字段组件属性设置
     */
    public String formFieldId;
    /***
     * 关联组件
     * pageComponentId有值的场景自定义页面
     */
    public String pageComponentId;
    /**
     * 属性名称
     */
    public String propName;
    /**
     * 子属性名称
     * (数组属性)
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
     * match->func-key jie
     */
    public String relateVal;
    /***
     * 数据过滤
     * (准备移除，采用conditionJson方式后端过滤)
     * 多个过滤器之间用逗号隔开，字段与字段值之间用冒号隔开
     * [type:eee,ageFunc] 表示使用查询type=eee和ageFunc函数进行数据过过滤
     */
    public String filterFunc;
    /**
     * 过滤条件的连接方式
     * and/or
     */
    public String filterConnectionType;
    /**
     * 接口过滤条件
     * 来源于接口则可以配置一个通用的过滤条件组
     */
    public String conditionJson;

    public String getFormFieldId() {
        return formFieldId;
    }

    public String getPageComponentId() {
        return pageComponentId;
    }

    public String getPropName() {
        return propName;
    }

    public String getSubName() {
        return subName;
    }

    public Integer getListNo() {
        return listNo;
    }

    public String getSourceType() {
        return sourceType;
    }

    public String getPropVal() {
        return propVal;
    }

    public String getRelateVal() {
        return relateVal;
    }

    public String getFilterFunc() {
        return filterFunc;
    }

    public String getFilterConnectionType() {
        return filterConnectionType;
    }

    @Column(columnDefinition = "text")
    public String getConditionJson() {
        return conditionJson;
    }

}
