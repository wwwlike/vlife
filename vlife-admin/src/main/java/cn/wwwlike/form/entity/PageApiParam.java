package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 组件API参数设置
 */
@Entity
@Data
@Table(name="page_api_param")
@VClazz(module = "conf")
public class PageApiParam extends DbEntity {
    /***
     * 组件属性
     */
    public String pageComponentPropId;
    /**
     * 参数名称
     */
    public String paramName;
    /**
     * 参数值来源
     * 系统值/常量值/对象字段取值/接口取值
     */
    public String sourceType;
    /**
     * 参数值
     */
    public String paramVal;

}
