package cn.vlife.erp.entity;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 销售单
 */
@Data
@Entity
@Table(name = "erp_order_sale")
public class OrderSale extends DbEntity implements INo {
    /**
     * 订单编号
     */
    public String no;
    /**
     * 客户
     */
    public String customerId;
    /**
     * 销售员
     */
    public String sysUserId;

    /**
     * 下单日期
     */
    public Date orderDate;
    /**
     * 销售单状态
     */
    @VField(dictCode = "order_sale_state")
    public String  state;
    /**
     * 备注
     */
    public String remark;

    /**
     * 销售总额(元)
     */
    public Double totalPrice;
}
