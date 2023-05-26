package cn.wwwlike.erp.api;

import cn.wwwlike.erp.dto.OrderPurchaseDto;
import cn.wwwlike.erp.entity.OrderPurchase;
import cn.wwwlike.erp.req.OrderPurchasePageReq;
import cn.wwwlike.erp.service.OrderPurchaseService;
import cn.wwwlike.util.EntityStateDto;
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
 * 采购单接口;
 */
@RestController
@RequestMapping("/orderPurchase")
public class OrderPurchaseApi extends VLifeApi<OrderPurchase, OrderPurchaseService> {
  /**
   * 分页查询采购单;
   * @param req 采购单查询;
   * @return 采购单;
   */
  @GetMapping("/page")
  public PageVo<OrderPurchase> page(OrderPurchasePageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存采购单;
   * @param dto 采购单;
   * @return 采购单;
   */
  @PostMapping("/save/orderPurchaseDto")
  public OrderPurchaseDto saveOrderPurchaseDto(@RequestBody OrderPurchaseDto dto) {
    dto.setState("2");
    return service.save(dto);
  }

  /**
   * 明细查询采购单;
   * @param id 主键id;
   * @return 采购单;
   */
  @GetMapping("/detail/{id}")
  public OrderPurchase detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove/{id}")
  public Long remove(@PathVariable String id) {
    return service.remove(id);
  }



  /**
   * 更新用户状态
   * @param dto
   * @return
   */
  @PostMapping("/state")
  public List<String> state(@RequestBody EntityStateDto dto){
    return service.save("state",dto.getState(),dto.getIds().toArray(new String[dto.getIds().size()]));
  }

}
