package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.PageComponent;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

@Data
public class PageComponentDto implements SaveBean<PageComponent> {
    /**
     * 单元名称
     */
    public String name;
    /**
     * 排序号
     */
    public Integer sort;

    public String id;
    /***
     * 组件单元所在页面
     */
    public String pageLayoutId;
    /**
     * 单元编号
     */
    public String pageKey;
    /**
     * 单元组件类型
     * 关联展示型视图
     */
    public String component;
    /**
     * 栅格横向位置
     */
    public Integer x;
    /**
     * 栅格纵坐标位置
     */
    public Integer y;
    /**
     * 栅格宽度
     */
    public Integer w;
    /**
     * 栅格高度
     */
    public Integer h;

    /**
     * layout布局索引
     * 在div里用key设置
     */
    public String i;

    /**
     * 布局的层次
     */
    public  Integer z;


    public String moduleId;

    /**
     * 组件置顶
     */
    public Boolean layoutTop;
    /**
     * 组件属性数据
     * 待移除
     */
    public String componentPropJson;

    /**
     * 组件属性配置
     * 自定义prop方式配置组件属性
     */
    public List<PageComponentPropDto> props;

}
