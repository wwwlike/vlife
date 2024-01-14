package cn.vlife.erp.api;

import cn.vlife.erp.entity.OrderSendDetail;
import cn.vlife.erp.service.OrderSendDetailService;
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
 * 发货明细接口 
 */
@RestController
@RequestMapping("/orderSendDetail")
public class OrderSendDetailApi extends VLifeApi<OrderSendDetail, OrderSendDetailService> {
  /**
   * 分页查询发货明细
   * @param req 
   * @return 发货明细
   */
  @PostMapping("/page")
  public PageVo<OrderSendDetail> page(@RequestBody PageQuery req) {
    return service.findPage(req);
  }

  /**
   * 保存发货明细
   * @param orderSendDetail 发货明细
   * @return 发货明细
   */
  @PostMapping("/save")
  public OrderSendDetail save(@RequestBody OrderSendDetail orderSendDetail) {
    return service.save(orderSendDetail);
  }

  /**
   * 明细查询发货明细
   * @param id 主键id
   * @return 发货明细
   */
  @GetMapping("/detail/{id}")
  public OrderSendDetail detail(@PathVariable String id) {
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
