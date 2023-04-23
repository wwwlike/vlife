package cn.wwwlike.erp.api;

import cn.wwwlike.erp.entity.OrderPurchaseDetail;
import cn.wwwlike.erp.service.OrderPurchaseDetailService;
import cn.wwwlike.vlife.core.VLifeApi;
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
 * 采购单接口;
 */
@RestController
@RequestMapping("/orderPurchaseDetail")
public class OrderPurchaseDetailApi extends VLifeApi<OrderPurchaseDetail, OrderPurchaseDetailService> {
  /**
   * 保存采购单;
   * @param dto 采购单;
   * @return 采购单;
   */
  @PostMapping("/save/orderPurchase")
  public OrderPurchaseDetail saveOrderPurchase(@RequestBody OrderPurchaseDetail dto) {
    return service.save(dto);
  }

  /**
   * 明细查询采购单;
   * @param id 主键id;
   * @return 采购单;
   */
  @GetMapping("/detail/{id}")
  public OrderPurchaseDetail detail(@PathVariable String id) {
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
}
