package cn.vlife.erp.api;

import cn.vlife.erp.common.ErpDict;
import cn.vlife.erp.dto.OrderSaleDto;
import cn.vlife.erp.dto.OrderSendDto;
import cn.vlife.erp.entity.OrderSale;
import cn.vlife.erp.entity.OrderSend;
import cn.vlife.erp.entity.OrderSendDetail;
import cn.vlife.erp.service.ItemStockService;
import cn.vlife.erp.service.OrderSaleService;
import cn.vlife.erp.service.OrderSendService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import java.lang.Long;
import java.lang.String;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 发货单接口;
 */
@RestController
@RequestMapping("/orderSend")
public class OrderSendApi extends VLifeApi<OrderSend, OrderSendService> {
  @Autowired
  public OrderSaleService saleService;
  @Autowired
  public ItemStockService stockService;//库存

  /**
   * 分页查询发货单;
   * @param req ;
   * @return 发货单;
   */
  @PostMapping("/page")
  public PageVo<OrderSend> page(@RequestBody PageQuery req) {
    return service.findPage(req);
  }


  /**
   * 处理状态变更
   * @param orderSend
   * @return
   */
  @PostMapping("/save")
  public OrderSend save(@RequestBody OrderSend orderSend) {
    return service.save(orderSend);
  }


  /**
   * 保存发货单dto;
   * @param orderSendDto 发货单dto;
   * @return 发货单dto;
   */
  @PostMapping("/save/orderSendDto")
  public OrderSendDto saveOrderSendDto(@RequestBody OrderSendDto orderSendDto) {
    service.save(orderSendDto,true);
    if(ErpDict.order_send_state.finish.equals(orderSendDto.getState())){ //发货减库存
      stockService.saleOut(orderSendDto);
      OrderSale order=saleService.findOne(orderSendDto.getOrderSaleId());
      if(order.getState().equals(ErpDict.order_sale_state.paid)){
        order.setState(ErpDict.order_sale_state.send);
        saleService.save(order);
      }
    }
    //修改销售单状态
    return orderSendDto;
  }

  /**
   * 明细查询发货单;
   * @param id 主键id;
   * @return 发货单;
   */
  @GetMapping("/detail/{id}")
  public OrderSend detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }

  /**
   * 加载销售单对应的发货单
   * 一张销售单对应一张发货单
   * @param orderSaleId
   * @return
   */
  @GetMapping("/loadOrderSaleSend/{orderSaleId}")
  public OrderSendDto loadOrderSaleSend(@PathVariable String orderSaleId){
    List<OrderSendDto> list=service.query(OrderSendDto.class, QueryWrapper.of(OrderSend.class).eq("orderSaleId",orderSaleId));
    if(list!=null&&list.size()>0)
      return list.get(0);
    return service.initByOrderSale(saleService.queryOne(OrderSaleDto.class,orderSaleId));
  }

}
