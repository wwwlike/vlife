package cn.vlife.erp.api;

import cn.vlife.erp.entity.Product;
import cn.vlife.erp.req.ProductPageReq;
import cn.vlife.erp.service.ProductService;
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
 * 产品接口 
 */
@RestController
@RequestMapping("/product")
public class ProductApi extends VLifeApi<Product, ProductService> {
  /**
   * 分页查询产品
   * @param req 产品查询
   * @return 产品
   */
  @PostMapping("/page")
  public PageVo<Product> page(@RequestBody ProductPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存产品
   * @param product 产品
   * @return 产品
   */
  @PostMapping("/save")
  public Product save(@RequestBody Product product) {
    return service.save(product);
  }

  /**
   * 明细查询产品
   * @param id 主键id
   * @return 产品
   */
  @GetMapping("/detail/{id}")
  public Product detail(@PathVariable String id) {
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
