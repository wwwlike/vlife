package cn.vlife.erp.service;

import cn.vlife.erp.dao.OrderSendDao;
import cn.vlife.erp.dto.OrderSaleDto;
import cn.vlife.erp.dto.OrderSendDto;
import cn.vlife.erp.entity.OrderSend;
import cn.vlife.erp.entity.OrderSendDetail;
import cn.wwwlike.common.BaseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderSendService extends BaseService<OrderSend, OrderSendDao> {

    /**
     * 发货单初始化
     */
    public OrderSendDto initByOrderSale(OrderSaleDto saleDto){
        OrderSendDto send=new OrderSendDto();
        send.setOrderSaleId(saleDto.getId());
        List<OrderSendDetail> detailList=saleDto.getDetails().stream().map(d->{
            OrderSendDetail detail= new OrderSendDetail();
            detail.setNum(d.getTotal());
            detail.setPrice(d.getPrice());
            detail.setProductId(d.getProductId());
            return detail;
        }).collect(Collectors.toList());
        send.setDetails(detailList);
        return send;
    }
}
