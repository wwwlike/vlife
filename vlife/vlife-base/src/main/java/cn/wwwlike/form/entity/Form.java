package cn.wwwlike.form.entity;

/**
 * 表单/列表/视图
 */

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * 模型表
 * form->就是model
 * 所有分类模型，如在前端的表单(编辑和查询)和列表以何种形式展示需要再该表里配置
 * 数据来源于后端解析和页面维护的数据
 */
@Entity
//@Data
@Table(name = "form")
@VClazz(remove = {PageComponentProp.class})
public class Form extends DbEntity {
    /**
     * 模型代表字段
     * label/title/name/id 按照这个优先级进行设置
     */
    public String labelField;
    /**
     * 模型标识
     */
    public String type;
    /**
     * 模型父类字符串集合
     */
    public String typeParentsStr;
    /**
     * 关联实体
     * 对应的实体模型标识
     */
    public String entityType;
    /**
     * 模型分类
     * req|entity|vo|dto
     */
    public String itemType;
    /**
     * 模型名称
     * type对应的名称，后端注释提取的
     */
    public String title;
    //模型的相关页面配置数据
    /**
     * 表单名称
     * 前端命名的
     */
    public String name;
    /**
     * 页面大小
     * 1. 对于form可以确定弹出层大小(tailwind的比例)
     * 2. field的gridSpan最小支持的约束
     */
    public Integer modelSize;
    /**
     * 分页数量
     * 0 表示列表不分页
     */
    public Integer pageSize;
    /**
     * 图标
     */
    public String icon;
    /**
     * 版本
     * 保存一次版本加一
     */
    public Integer version;
    /**
     * 分页列表api代码路径
     */
    public String listApiPath;
    /**
     * 分页列表api代码路径
     */
    public String saveApiPath;
    /**
     * 编号前缀
     * 需要实体模型实现INo接口则能设置该字段
     */
    public String prefixNo;
    /**
     * 关联表展示字段name
     * 提取vclass的label表达式
     */
    public String itemName;
    //页面模块appId
    public String sysMenuId;
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
    //用户自定义
    public Boolean custom;

    public String getLabelField() {
        return labelField;
    }

    public void setLabelField(String labelField) {
        this.labelField = labelField;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTypeParentsStr() {
        return typeParentsStr;
    }

    public void setTypeParentsStr(String typeParentsStr) {
        this.typeParentsStr = typeParentsStr;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getModelSize() {
        return modelSize;
    }

    public void setModelSize(Integer modelSize) {
        this.modelSize = modelSize;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getListApiPath() {
        return listApiPath;
    }

    public void setListApiPath(String listApiPath) {
        this.listApiPath = listApiPath;
    }

    public String getSaveApiPath() {
        return saveApiPath;
    }

    public void setSaveApiPath(String saveApiPath) {
        this.saveApiPath = saveApiPath;
    }

    public String getPrefixNo() {
        return prefixNo;
    }

    public void setPrefixNo(String prefixNo) {
        this.prefixNo = prefixNo;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getSysMenuId() {
        return sysMenuId;
    }

    public void setSysMenuId(String sysMenuId) {
        this.sysMenuId = sysMenuId;
    }

    public String getFormDesc() {
        return formDesc;
    }

    public void setFormDesc(String formDesc) {
        this.formDesc = formDesc;
    }

    public String getHelpDoc() {
        return helpDoc;
    }

    public void setHelpDoc(String helpDoc) {
        this.helpDoc = helpDoc;
    }

    @Column(columnDefinition = "text")
    public String getFlowJson() {
        return flowJson;
    }

    public void setFlowJson(String flowJson) {
        this.flowJson = flowJson;
    }

    @Column(columnDefinition = "text")
    public String getUnpublishJson() {
        return unpublishJson;
    }

    public void setUnpublishJson(String unpublishJson) {
        this.unpublishJson = unpublishJson;
    }

    public Boolean getCustom() {
        return custom;
    }

    public void setCustom(Boolean custom) {
        this.custom = custom;
    }
}
