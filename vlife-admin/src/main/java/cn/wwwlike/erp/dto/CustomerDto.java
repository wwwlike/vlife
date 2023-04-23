package cn.wwwlike.erp.dto;

import cn.wwwlike.erp.entity.Customer;
import cn.wwwlike.erp.entity.LinkMan;
import cn.wwwlike.erp.entity.Supplier;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 客户信息登记
 */
@Data
public class CustomerDto implements SaveBean<Customer> {
    public String id;
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


    public List<LinkMan> linkManList ;
}
