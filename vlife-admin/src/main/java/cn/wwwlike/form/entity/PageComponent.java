package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 单元组件信息
 * 页面关联的组件设置信息
 */
@Entity
@Data
@Table(name="page_component")
public class PageComponent extends DbEntity {
    /***
     * 组件单元所在页面
     */
    public String pageLayoutId;
    /**
     * 单元编号
     */
    public String pageKey;
    /**
     * 单元名称
     */
    public String name;
    /**
     * 单元组件类型
     * 关联展示型视图
     */
    @VField(dictCode = "VIEW_COMPONENT")
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

}
