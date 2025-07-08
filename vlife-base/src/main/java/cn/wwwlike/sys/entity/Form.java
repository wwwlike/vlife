package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Setter;
import javax.persistence.*;

/**
 * 模型表
 */
@Entity
@Table(name = "form")
@Setter
@VClazz(remove = {PageComponentProp.class, SysResources.class,SysMenu.class,FormField.class})
public class Form extends DbEntity {
    //模型名称
    public String title;
    //模型标识
    public String type;
    //所属应用
    public String sysAppId;
    //已关联菜单
    public String sysMenuId;
    /**
     * 关联实体
     * 如自身就是实体则存储当前表id
     */
    public String entityId;
    //关联实体type
    public String entityType;
    //表名
    public String tableName;
    //模型分类
    @VField(dictCode = "MODEL_TYPE")
    public String itemType;
    /**
     * 发布状态
     */
    @VField(dictCode = "MODEL_STATE")
    public String state;
    //待发布的表单JSON
    public String unpublishForm;
    //默认排序
    public String orders;
    //完整类名
    public String typeClass;
    //父类集合
    public String typeParentsStr;
    //每行列数
    public Integer modelSize;
    //紧凑布局
    public Boolean terse;
    /**
     * 级联删除模型名集合
     * 多个则中间逗号分隔
     */
    public String cascadeDeleteEntityNames;

    // 以下待优化字段
    /**
     * 填报说明
     * 表单填报指导说明
     */
    public String formDesc;
    /**
     * 帮助文档
     * 开发环境时给的开发人员的提示
     */
    public String helpDoc;
    //流程脚本
    public String flowJson;
    //待发布的流程脚本
    public String unpublishJson;

    public String getSysAppId() {
        return sysAppId;
    }
    public String getType() {
        return type;
    }
    public String getTableName() {
        return tableName;
    }
    public String getTypeParentsStr() {
        return typeParentsStr;
    }
    @Column(length = 255)
    public String getCascadeDeleteEntityNames() {
        return cascadeDeleteEntityNames;
    }
    public String getEntityType() {
        return entityType;
    }
    public String getItemType() {
        return itemType;
    }
    public String getTitle() {
        return title;
    }
    public Integer getModelSize() {
        return modelSize;
    }
    public String getFormDesc() {
        return formDesc;
    }
    public String getHelpDoc() {
        return helpDoc;
    }
    @Column(columnDefinition = "text")
    public String getFlowJson() {
        return flowJson;
    }
    @Column(columnDefinition = "text")
    public String getUnpublishJson() {
        return unpublishJson;
    }
    public String getState() {
        return state;
    }
    public String getOrders() {
        return orders;
    }
    @Column(columnDefinition = "text")
    public String getUnpublishForm() {
        return unpublishForm;
    }
    public String getTypeClass() {
        return typeClass;
    }
    public Boolean getTerse() {
        return terse;
    }
    public String getEntityId() {
        return entityId;
    }
    public String getSysMenuId() {
        return sysMenuId;
    }
}
