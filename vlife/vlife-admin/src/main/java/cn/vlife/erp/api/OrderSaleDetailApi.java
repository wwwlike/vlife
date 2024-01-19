package cn.vlife.erp.api;

import cn.vlife.erp.entity.OrderSaleDetail;
import cn.vlife.erp.service.OrderSaleDetailService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
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
 * 销售明细接口 
 */
@RestController
@RequestMapping("/orderSaleDetail")
public class OrderSaleDetailApi extends VLifeApi<OrderSaleDetail, OrderSaleDetailService> {
  /**
   * 分页查询销售明细
   * @param req 
   * @return 销售明细
   */
  @PostMapping("/page")
  public PageVo<OrderSaleDetail> page(@RequestBody PageQuery req) {
    return service.findPage(req);
  }


  //销售明细列表
  @PostMapping("/list")
  public List<OrderSaleDetail> list(@RequestBody PageQuery req) {
    return service.find(req);
  }

  /**
   * 保存销售明细
   * @param orderSaleDetail 销售明细
   * @return 销售明细
   */
  @PostMapping("/save")
  public OrderSaleDetail save(@RequestBody OrderSaleDetail orderSaleDetail) {
    return service.save(orderSaleDetail);
  }

  /**
   * 明细查询销售明细
   * @param id 主键id
   * @return 销售明细
   */
  @GetMapping("/detail/{id}")
  public OrderSaleDetail detail(@PathVariable String id) {
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
