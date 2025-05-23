package cn.vlife.erp.api;

import cn.vlife.erp.dto.ErpOrderInbound;
import cn.vlife.erp.dto.ErpOrderPurchaseDto;
import cn.vlife.erp.service.ErpOrderPurchaseService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/erpOrderInbound")
public class ErpOrderInboundApi extends VLifeApi<ErpOrderInbound, ErpOrderPurchaseService> {
    /**
     * 入库测试
     * @param dto
     * @return
     */
    @PostMapping("/inbound")
    public ErpOrderInbound inbound(@RequestBody ErpOrderInbound dto){
        return dto;
    }
}
