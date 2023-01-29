package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.PageComponent;
import cn.wwwlike.form.entity.PageComponentProp;
import cn.wwwlike.form.entity.PageLayout;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

@Data
public class PageComponentDto implements SaveBean<PageComponent> {
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
     * 布局的层次
     */
    public Integer i;

    public String moduleId;

    /**
     * 组件置顶
     */
    public Boolean layoutTop;

    /**
     * 组件属性配置
     */
    public List<PageComponentPropDto> props;
}
