package cn.vlife.erp.api;

import cn.vlife.erp.entity.ItemStock;
import cn.vlife.erp.req.ItemStockPageReq;
import cn.vlife.erp.service.ItemStockService;
import cn.vlife.erp.vo.ItemStockVo;
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
 * 商品库存接口 
 */
@RestController
@RequestMapping("/itemStock")
public class ItemStockApi extends VLifeApi<ItemStock, ItemStockService> {
  /**
   * 分页查询商品库存(视图)
   * @param req 库存查询
   * @return 商品库存(视图)
   */
  @PostMapping("/page")
  public PageVo<ItemStockVo> page(@RequestBody ItemStockPageReq req) {
    return service.queryPage(ItemStockVo.class,req);
  }

  /**
   * 保存商品库存
   * @param itemStock 商品库存
   * @return 商品库存
   */
  @PostMapping("/save")
  public ItemStock save(@RequestBody ItemStock itemStock) {
    return service.save(itemStock);
  }

  /**
   * 明细查询商品库存(视图)
   * @param id 主键id
   * @return 商品库存(视图)
   */
  @GetMapping("/detail/{id}")
  public ItemStockVo detail(@PathVariable String id) {
    return service.queryOne(ItemStockVo.class,id);
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
