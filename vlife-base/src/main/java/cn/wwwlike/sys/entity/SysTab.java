package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Setter;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 视图页签
 */
@Entity
@Setter
@Table
@VClazz(remove = {SysTabVisit.class,SysTabButton.class})//,PageComponent.class
public class SysTab extends DbEntity {
    //所属页面
    public String sysMenuId;
    //视图标题
    public String title;
    //视图顺序
    public Integer sort;
    //列表按钮展示位置
    @VField(dictCode = "FORM_SHOW_TYPE")
    public String formShowType;
    /**
     * 实体模型
     */
    public String formId;
    //数据权限
    @VField(dictCode = "DATA_LEVEL")
    public String dataLevel;
    //数据范围
    public String conditionJson;
    //排序方式
    @VField(dictCode = "ORDER_TYPE")
    public String orderType;
    //排序字段
    public String orderFieldName;
    //排序方向
    @VField(dictCode = "ORDER_DIRECTION")
    public String orderDirection;
    //图标
    public String icon;
    //视图类型
    public String viewType;
    /**
     * 列表字段
     * 按顺序用逗号分隔列表展示字段(减少一张表)
     */
    public String fieldNames;

    public String getSysMenuId() {
        return sysMenuId;
    }

    public String getTitle() {
        return title;
    }

    public String getViewType() {
        return viewType;
    }

    public Integer getSort() {
        return sort;
    }

    public String getIcon() {
        return icon;
    }

    @Column(columnDefinition = "text")
    public String getConditionJson() {
        return conditionJson;
    }

    public String getDataLevel() {
        return dataLevel;
    }

    public String getOrderType() {
        return orderType;
    }

    public String getOrderFieldName() {
        return orderFieldName;
    }

    public String getFormShowType() {
        return formShowType;
    }

    public String getOrderDirection() {
        return orderDirection;
    }
    //后面可根据存储字段配置调整为json形式
    @Column(length = 500)
    public String getFieldNames() {
        return fieldNames;
    }

    public String getFormId() {
        return formId;
    }
}
