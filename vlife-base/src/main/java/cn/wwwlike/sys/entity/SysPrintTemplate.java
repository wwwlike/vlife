package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Setter;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 打印模版
 */
@Entity
@Setter
@Table
public class SysPrintTemplate extends DbEntity {
    /**
     * 模版名称
     */
    public String name;
    /**
     * 关联模型
     */
    public String formId;
    /**
     * 模版内容
     */
    public String templateHtml;
    /**
     * 电子印章
     */
    public String stamp;

    public String getName() {
        return name;
    }
    public String getFormId() {
        return formId;
    }
    @Column(columnDefinition = "text")
    public String getTemplateHtml() {
        return templateHtml;
    }
    public String getStamp() {
        return stamp;
    }
}
