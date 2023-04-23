package cn.wwwlike.erp.entity;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 联系人
 */
@Data
@Entity
@Table(name = "erp_linkman")
public class LinkMan  extends DbEntity {
    /**
     * 联系人姓名
     */
    public String name;
    /**
     * 职位
     */
    @VField(dictCode = "linkman_job")
    public String job;
    /**
     * 联系电话
     */
    public String tel;
    /**
     * 邮箱
     */
    public String email;
    /**
     * 备注
     */
    public String remark;
    /**
     * 供应商
     */
    public String supplierId;
    /**
     * 客户
     */
    public String customerId;
}
