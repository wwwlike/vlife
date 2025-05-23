package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.PageComponent;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 组件属性配置dto
 */
@Data
public class PageComponentDto extends SaveBean<PageComponent> {
    /**
     * 单元名称
     */
    public String name;
    /**
     * 排序号
     */
    public Integer sort;
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
     * 查看更多
     * 路由地址
     */
    public String more;
    /**
     * 组件属性配置
     * 自定义prop方式配置组件属性
     */
    public List<PageComponentPropDto> props;

}
