package cn.vlife.erp.api;

import cn.vlife.erp.entity.OrderPurchaseDetail;
import cn.vlife.erp.service.OrderPurchaseDetailService;
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
 * 采购明细接口 
 */
@RestController
@RequestMapping("/orderPurchaseDetail")
public class OrderPurchaseDetailApi extends VLifeApi<OrderPurchaseDetail, OrderPurchaseDetailService> {
  /**
   * 分页查询采购明细
   * @param req 
   * @return 采购明细
   */
  @PostMapping("/page")
  public PageVo<OrderPurchaseDetail> page(@RequestBody PageQuery req) {
    return service.findPage(req);
  }

  /**
   * 保存采购明细
   * @param orderPurchaseDetail 采购明细
   * @return 采购明细
   */
  @PostMapping("/save")
  public OrderPurchaseDetail save(@RequestBody OrderPurchaseDetail orderPurchaseDetail) {
    return service.save(orderPurchaseDetail);
  }

  /**
   * 明细查询采购明细
   * @param id 主键id
   * @return 采购明细
   */
  @GetMapping("/detail/{id}")
  public OrderPurchaseDetail detail(@PathVariable String id) {
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
