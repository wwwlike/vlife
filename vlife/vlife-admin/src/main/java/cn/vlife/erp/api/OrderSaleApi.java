package cn.vlife.erp.api;

import cn.vlife.erp.dto.OrderSaleDto;
import cn.vlife.erp.entity.OrderSale;
import cn.vlife.erp.req.OrderSalePageReq;
import cn.vlife.erp.service.OrderSaleService;
import cn.vlife.erp.vo.OrderSaleVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 销售单接口 
 */
@RestController
@RequestMapping("/orderSale")
public class OrderSaleApi extends VLifeApi<OrderSale, OrderSaleService> {
  /**
   * 分页查询销售单
   * @param req 销售单查询
   * @return 销售单
   */
  @PostMapping("/page")
  public PageVo<OrderSale> page(@RequestBody OrderSalePageReq req) {
    return service.findPage(req);
  }

  /**
   * 列表查询销售单
   * @param req 销售单查询
   * @return 销售单
   */
  @PostMapping("/list")
  public List<OrderSaleVo> list(@RequestBody OrderSalePageReq req) {
    return service.query(OrderSaleVo.class,req);
  }

  /**
   * 保存销售单据
   * @param orderSaleDto 销售单据
   * @return 销售单据
   */
  @PostMapping("/save/orderSaleDto")
  public OrderSaleDto saveOrderSaleDto(@RequestBody OrderSaleDto orderSaleDto) {
    if(orderSaleDto.getState()==null){
      orderSaleDto.setState("1");
    }
    return service.save(orderSaleDto,true);
  }

  /**
   * 保存销售单
   * @param orderSale 销售单
   * @return 销售单
   */
  @PostMapping("/save")
  public OrderSale save(@RequestBody OrderSale orderSale) {
    return service.save(orderSale);
  }

  /**
   * 明细查询销售单
   * @param id 主键id
   * @return 销售单
   */
  @GetMapping("/detail/{id}")
  public OrderSaleVo detail(@PathVariable String id) {
    return service.queryOne(OrderSaleVo.class,id);
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
