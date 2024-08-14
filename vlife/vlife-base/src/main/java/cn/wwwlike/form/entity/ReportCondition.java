package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * 视图配置
 */
@Entity
@Table(name = "report_condition")
public class ReportCondition extends DbEntity {
    /**
     * 查询名称
     */
    public String name;
    /**
     * 页面
     */
    public String sysMenuId;
    /**
     * 数据集
     */
    public String formId;
    /**
     * 查询条件
     */
    public String conditionJson;
    /**
     * 视图创建人
     */
    public String sysUserId;
    /**
     * 视图应用场景
     * report/table
     */
    @VField(dictCode = "CONDITION_TYPE")
    public String type;

    /**
     * 绑定权限组
     */
    public String sysGroupIds;

    @Column(columnDefinition = "text")
    public String getConditionJson() {
        return conditionJson;
    }

    public void setConditionJson(String conditionJson) {
        this.conditionJson = conditionJson;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSysMenuId() {
        return sysMenuId;
    }

    public void setSysMenuId(String sysMenuId) {
        this.sysMenuId = sysMenuId;
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public String getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(String sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Column(length = 1000)
    public String getSysGroupIds() {
        return sysGroupIds;
    }

    public void setSysGroupIds(String sysGroupIds) {
        this.sysGroupIds = sysGroupIds;
    }
}

