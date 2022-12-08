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
     * 接口请求后数据的转化方法
     */
    public String apiMethod;
    /**
     * 关联api参数设置
     */
    public List<PageApiParam> params;

}
