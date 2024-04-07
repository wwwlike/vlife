package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * 视图配置
 */
@Data
@Entity
@Table(name = "report_condition")
public class ReportCondition extends DbEntity {
    /**
     * 查询名称
     */
    public String name;
    /**
     * 应用
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
     * 场景
     * report/table
     */
    @VField(dictCode = "CONDITION_TYPE")
    public String type;
}

