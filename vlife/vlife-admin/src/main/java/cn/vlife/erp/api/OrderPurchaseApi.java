package cn.vlife.erp.api;

import cn.vlife.erp.dto.OrderPurchaseDto;
import cn.vlife.erp.entity.OrderPurchase;
import cn.vlife.erp.req.OrderPurchasePageReq;
import cn.vlife.erp.service.ItemStockService;
import cn.vlife.erp.service.OrderPurchaseService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购单接口
 */
@RestController
@RequestMapping("/orderPurchase")
public class OrderPurchaseApi extends VLifeApi<OrderPurchase, OrderPurchaseService> {
  @Autowired
  public ItemStockService stockService;

  /**
   * 分页查询采购单
   * @param req 采购单查询
   * @return 采购单
   */
  @PostMapping("/page")
  public PageVo<OrderPurchase> page(@RequestBody OrderPurchasePageReq req) {
    return service.findPage(req);
  }

  /**
   * 列表查询采购单
   * @param req 采购单查询
   * @return 采购单
   */
  @PostMapping("/list")
  public List<OrderPurchase> list(@RequestBody OrderPurchasePageReq req) {
    return service.find(req);
  }

  /**
   * 保存采购订单单据
   * @param orderPurchaseDto 采购订单单据
   * @return 采购订单单据
   */
  @PostMapping("/save/orderPurchaseDto")
  public OrderPurchaseDto saveOrderPurchaseDto(@RequestBody OrderPurchaseDto orderPurchaseDto) {
    if(orderPurchaseDto.getState()==null){
      orderPurchaseDto.setState("1");
    }
    if(orderPurchaseDto.getState().equals("3")){
      stockService.purchaseIn(orderPurchaseDto);
    }
    return service.save(orderPurchaseDto,true);
  }

  /**
   * 保存采购单
   * @param orderPurchase 采购单
   * @return 采购单
   */
  @PostMapping("/save")
  public OrderPurchase save(@RequestBody OrderPurchase orderPurchase) {
    return service.save(orderPurchase);
  }

  /**
   * 明细查询采购单
   * @param id 主键id
   * @return 采购单
   */
  @GetMapping("/detail/{id}")
  public OrderPurchase detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除
   * @param ids
   * @return 已删除数量
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
