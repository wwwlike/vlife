package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.PageApiParam;
import cn.wwwlike.form.entity.PageComponentProp;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

@Data
public class PageComponentPropDto implements SaveBean<PageComponentProp> {
   public String id;
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
     */
    public String sourceType;
    /**
     * 属性值
     */
    public String propVal;

    /**
     * 关联api参数设置
     */
    public List<PageApiParam> params;

    public String relateVal;

   /***
    * 数据转换key
    * filterFuns->key
    */
   public String filterFunc;
   // 多个多虑条件的数据连接方式
   public String filterConnectionType;
}
