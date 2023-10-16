package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 表单页签
 */
@Entity
@Data
@Table(name="form_tab")
@VClazz(module = "conf")
public class FormTab extends DbEntity {
    /**
     * 所在表单
     */
    public String formId;

    /**
     * 页签名
     */
    public String name;
    /**
     * Tab编码
     */
    public String code;
    /**
     * 排序号
     */
    public Integer sort;
}
