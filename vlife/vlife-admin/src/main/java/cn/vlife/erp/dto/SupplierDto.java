package cn.vlife.erp.dto;
import cn.vlife.erp.entity.LinkMan;
import cn.vlife.erp.entity.Supplier;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 供应商信息登记
 */
@Data
public class SupplierDto  implements SaveBean<Supplier> {
    public  String id;
    public String name;
    public String type;
    public String address;
    public String account;
    public String bank;
    public String cardNo;
    public List<LinkMan> linkManList ;
}
