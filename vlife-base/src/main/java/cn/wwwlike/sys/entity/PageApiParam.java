package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * API参数设置
 * 组件属性数据来源于api的相关入参信息
 */
@Entity
@Data
@Table(name="page_api_param")
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
     * 系统值/常量值/对象字段取值field/接口取值
     */
    public String sourceType;
    /**
     * 参数值
     * 取值是sourceType=field时则存在 key:value形式，key表示父表单type，参数来源于表单的字段
     */
    public String paramVal;

}
