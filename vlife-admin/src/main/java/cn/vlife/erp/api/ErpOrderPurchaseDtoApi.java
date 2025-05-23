// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.api;

import cn.vlife.erp.dto.ErpOrderInbound;
import cn.vlife.erp.dto.ErpOrderPurchaseDto;
import cn.vlife.erp.service.ErpOrderPurchaseService;
import cn.vlife.erp.service.ErpProductTotalService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 采购订单接口
 */
@RestController
@RequestMapping("/erpOrderPurchaseDto")
public class ErpOrderPurchaseDtoApi extends VLifeApi<ErpOrderPurchaseDto, ErpOrderPurchaseService> {

    @Autowired
    private ErpProductTotalService productTotalService;

    /**
     * 入库
     * @param dto
     * @return
     */
    @PostMapping("/inbound")
    public ErpOrderInbound inbound(@RequestBody ErpOrderInbound dto){
        String inboundState=dto.getState();//已入库
        ErpOrderPurchaseDto order=service.queryOne(ErpOrderPurchaseDto.class,dto.getId());
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(order.getErpOrderPurchaseItem()!=null&&order.getErpOrderPurchaseItem().size()>0,"订单里没有采购明细");
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(!order.getState().equals(inboundState),"该采购单已经完成收货");
        productTotalService.productsIn(order.getErpOrderPurchaseItem(), dto.getErpWarehouseId());
        order.setState(inboundState);//状态更新
        order.getErpOrderPurchaseItem().forEach(item->{
            item.setReceived(item.getTotal());//入库接收数量
            item.setErpWarehouseId(dto.getErpWarehouseId());//仓库
        });
        service.save(order);
        dto.setState(inboundState);
        return dto;
    }

}
