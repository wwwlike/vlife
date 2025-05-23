package cn.vlife.erp.dto;

import cn.vlife.erp.entity.ErpOrderPurchase;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * 采购入库
 */
@Data
public class ErpOrderInbound extends SaveBean<ErpOrderPurchase> {

    //入库仓库
    @VField(skip = true)
    public String erpWarehouseId;
    /**
     * 单据状态
     */
    public String state;

}
