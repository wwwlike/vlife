package cn.vlife.erp.dto;
import cn.vlife.erp.entity.Customer;
import cn.vlife.erp.entity.LinkMan;
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
    public String name;
    public String address;
    public String remark;
    public String tel;
    public String bank;
    public String accountNo;
    public  String  taxNo;
    public  String  taxTitle;
    public List<LinkMan> linkManList ;
}
