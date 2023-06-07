package cn.wwwlike.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 供应商
 */
@Data
@Entity
@Table(name = "erp_supplier")
@VClazz(module = "erp")
public class Supplier extends DbEntity {
    /**
     * 供应商名称
     */
    public String name;
    /**
     * 供应商类别
     */
    @VField(dictCode = "supplierType")
    public String type;
    /**
     * 详细地址
     */
    public String address;
    /**
     * 收款账户户名
     */
    public String account;
    /**
     * 开户银行
     */
    public String bank;
    /**
     * 银行账号
     */
    public String cardNo;
}


