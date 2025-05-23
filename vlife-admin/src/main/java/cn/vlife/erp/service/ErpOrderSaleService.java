// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.service;

import cn.vlife.erp.dao.ErpOrderSaleDao;
import cn.vlife.erp.dto.ErpOrderSaleDto;
import cn.vlife.erp.dto.ErpOrderSaleSendDto;
import cn.vlife.erp.entity.ErpOrderSale;
import cn.vlife.erp.entity.ErpOrderSaleItem;
import cn.vlife.erp.entity.ErpOrderSaleSendItem;
import cn.wwwlike.common.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ErpOrderSaleService extends BaseService<ErpOrderSale, ErpOrderSaleDao> {

    @Autowired
    private ErpOrderSaleSendItemService sendItemService;

    /**
     * 更进销售单的发货状态
     * 订单明细都发送完毕改为已发送，有发货记录就是发货中
     */
    public void updateState(String saleId) {
        boolean allSend=true;//默认全都发送
        ErpOrderSaleDto saleDto=queryOne(ErpOrderSaleDto.class,saleId);
        for(ErpOrderSaleItem item:saleDto.getErpOrderSaleItem()){
            if(item.getWait()>0){
                allSend=false;
            }
        }
        if(allSend){
            saleDto.setState("6");
        }else{
            saleDto.setState("5");
        }
        save(saleDto);
    }
}