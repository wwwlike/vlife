package cn.wwwlike.sys.entity;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 页面布局
 * 具体元素存在于pageComponent
 * 看板报表的简单场景下sysMenu是可以替换该实体模型
 */
@Entity
@Data
@Table(name="page_layout")
public class PageLayout extends DbEntity {
    /**
     * 页面名称
     */
    public String name;
    /**
     * 类面类型
     */
    @VField(dictCode = "PAGE_TYPE")
    public String pageType;
    /**
     * 作为模块使用
     */
    public Boolean module;
    /**
     * 组件覆盖
     */
    public Boolean componentOver;
    /**
     * card布局
     * 有刷新和放大按钮，且页面会有一定的间隔
     */
    public Boolean border;
    /**
     * 图标
     */
    public String img;
    /**
     * 访问地址
     */
    public String url;
    /**
     * 组件页面高度
     */
    public Integer h;
    /**
     * 大屏模式
     */
    public Boolean bigScreen;

}
