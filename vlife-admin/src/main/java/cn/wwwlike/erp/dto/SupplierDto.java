package cn.wwwlike.erp.dto;

import cn.wwwlike.erp.entity.LinkMan;
import cn.wwwlike.erp.entity.Supplier;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 供应商信息登记
 */
@Data
public class SupplierDto  implements SaveBean<Supplier> {
    public  String id;
    /**
     * 供应商名称
     */
    public String name;
    /**
     * 供应商类别
     */
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
    /**
     * 联系人
     */
    public List<LinkMan> linkManList ;
}
