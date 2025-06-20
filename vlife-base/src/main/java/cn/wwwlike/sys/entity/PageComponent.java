package cn.wwwlike.sys.entity;
import cn.wwwlike.vlife.bean.DbEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
/**
 * 单元组件信息
 * 单个组件的配置信息
 */
@Entity
@Table(name="page_component")
public class PageComponent extends DbEntity {
    /***
     * 组件单元所在页面
     */
    public String pageLayoutId;
    /**
     * 排序号
     */
    public Integer sort;
    /**
     * 单元编号
     * 系统命名comp开头
     */
    public String pageKey;
    /**
     * 单元名称
     */
    public String name;
    /**
     * 组件标识
     * 英文组件名称 compData里配置
     */
    public String component;
    /**
     * 模块id(pageLayoutId)
     */
    public String moduleId;
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

    public String i;
    /**
     * 布局的层次
     */
    public  Integer z;
    /**
     * 固定放置在顶端
     * 页面级有效
     */
    public Boolean layoutTop;
    /**
     * 数据视图
     */
    public String sysTabId;
    /**
     * 组件属性数据
     */
    public String componentPropJson;
    /**
     * 视图过滤
     */
    public String conditionJson;
    /**
     * 查看更多
     * 路由地址
     */
    public String more;

    @Column(length = 4000)
    public String  getComponentPropJson(){
        return componentPropJson;
    }

    @Column(length = 4000)
    public String  getConditionJson(){
        return conditionJson;
    }

    public String getPageLayoutId() {
        return pageLayoutId;
    }

    public void setPageLayoutId(String pageLayoutId) {
        this.pageLayoutId = pageLayoutId;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getPageKey() {
        return pageKey;
    }

    public void setPageKey(String pageKey) {
        this.pageKey = pageKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getW() {
        return w;
    }

    public void setW(Integer w) {
        this.w = w;
    }

    public Integer getH() {
        return h;
    }

    public void setH(Integer h) {
        this.h = h;
    }

    public String getI() {
        return i;
    }

    public void setI(String i) {
        this.i = i;
    }

    public Integer getZ() {
        return z;
    }

    public void setZ(Integer z) {
        this.z = z;
    }

    public Boolean getLayoutTop() {
        return layoutTop;
    }

    public void setLayoutTop(Boolean layoutTop) {
        this.layoutTop = layoutTop;
    }

    public void setComponentPropJson(String componentPropJson) {
        this.componentPropJson = componentPropJson;
    }

    public void setConditionJson(String conditionJson) {
        this.conditionJson = conditionJson;
    }
    public String getMore() {
        return more;
    }

    public void setMore(String more) {
        this.more = more;
    }

    public String getSysTabId() {
        return sysTabId;
    }

    public void setSysTabId(String sysTabId) {
        this.sysTabId = sysTabId;
    }
}
