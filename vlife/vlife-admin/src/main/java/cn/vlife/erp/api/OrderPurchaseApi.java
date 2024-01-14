package cn.vlife.erp.api;

import cn.vlife.erp.dto.OrderPurchaseDto;
import cn.vlife.erp.entity.OrderPurchase;
import cn.vlife.erp.req.OrderPurchasePageReq;
import cn.vlife.erp.service.OrderPurchaseService;
import cn.wwwlike.vlife.bean.PageVo;
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
 * 采购单接口 
 */
@RestController
@RequestMapping("/orderPurchase")
public class OrderPurchaseApi extends VLifeApi<OrderPurchase, OrderPurchaseService> {
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
   * 提交采购单据
   * @param dto 采购单据
   * @return 采购单据
   */
  @PostMapping("/OrderPurchaseDto")
  public OrderPurchaseDto OrderPurchaseDto(@RequestBody OrderPurchaseDto dto) {
    return service.save(dto);
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
