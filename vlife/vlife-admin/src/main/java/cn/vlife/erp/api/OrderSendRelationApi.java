package cn.vlife.erp.api;

import cn.vlife.erp.entity.OrderSendRelation;
import cn.vlife.erp.service.OrderSendRelationService;
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
 * 入库出库关联表接口 
 */
@RestController
@RequestMapping("/orderSendRelation")
public class OrderSendRelationApi extends VLifeApi<OrderSendRelation, OrderSendRelationService> {
  /**
   * 分页查询入库出库关联表
   * @param req 
   * @return 入库出库关联表
   */
  @PostMapping("/page")
  public PageVo<OrderSendRelation> page(@RequestBody PageQuery req) {
    return service.findPage(req);
  }

  /**
   * 保存入库出库关联表
   * @param orderSendRelation 入库出库关联表
   * @return 入库出库关联表
   */
  @PostMapping("/save")
  public OrderSendRelation save(@RequestBody OrderSendRelation orderSendRelation) {
    return service.save(orderSendRelation);
  }

  /**
   * 明细查询入库出库关联表
   * @param id 主键id
   * @return 入库出库关联表
   */
  @GetMapping("/detail/{id}")
  public OrderSendRelation detail(@PathVariable String id) {
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
