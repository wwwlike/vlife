package cn.wwwlike.erp.entity;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 客户
 */
@Data
@Entity
@Table(name = "erp_customer")
public class Customer extends DbEntity {
    /**
     * 相关销售
     */
    public String sysUserId;
    /**
     * 客户名称
     */
    public String name;

    /**
     * 客户地址
     */
    public String address;
    /**
     * 备注
     */
    public String remark;
    /**
     * 电话号码
     */
    public String tel;
    /**
     * 开户银行
     */
    public String bank;

    /**
     * 银行账号
     */
    public String accountNo;

    /**
     * 纳税人识别号
     */
    public  String  taxNo;

    /**
     * 开票抬头
     */
    public  String  taxTitle;

}
