package cn.vlife.erp.api;

import cn.vlife.erp.dto.OrderSendDto;
import cn.vlife.erp.entity.OrderSend;
import cn.vlife.erp.service.OrderSendService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import java.lang.Long;
import java.lang.String;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 发货单接口 
 */
@RestController
@RequestMapping("/orderSend")
public class OrderSendApi extends VLifeApi<OrderSend, OrderSendService> {
  /**
   * 分页查询发货单
   * @param req 
   * @return 发货单
   */
  @PostMapping("/page")
  public PageVo<OrderSend> page(@RequestBody PageQuery req) {
    return service.findPage(req);
  }

  /**
   * 保存发货单据
   * @param orderSendDto 发货单据
   * @return 发货单据
   */
  @PostMapping("/save/orderSendDto")
  public OrderSendDto saveOrderSendDto(@RequestBody OrderSendDto orderSendDto) {
    return service.save(orderSendDto);
  }

  /**
   * 明细查询发货单
   * @param id 主键id
   * @return 发货单
   */
  @GetMapping("/detail/{id}")
  public OrderSend detail(@PathVariable String id) {
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
