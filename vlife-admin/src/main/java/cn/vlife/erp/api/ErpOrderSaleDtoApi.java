// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.api;

import cn.vlife.erp.dto.ErpOrderInbound;
import cn.vlife.erp.dto.ErpOrderPurchaseDto;
import cn.vlife.erp.dto.ErpOrderSaleDto;
import cn.vlife.erp.service.ErpOrderSaleService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 销售订单接口
 */
@RestController
@RequestMapping("/erpOrderSaleDto")
public class ErpOrderSaleDtoApi extends VLifeApi<ErpOrderSaleDto, ErpOrderSaleService> {

    @PostMapping("/edit")
    public ErpOrderSaleDto edit(@RequestBody ErpOrderSaleDto dto){
        //待发货数量同步
        dto.getErpOrderSaleItem().forEach(d->{
            if(d.getWait()==null&& d.getTotalNum()!=null){
                d.setWait(d.getTotalNum());
            }
        });
        return super.edit(dto);
    }

}
