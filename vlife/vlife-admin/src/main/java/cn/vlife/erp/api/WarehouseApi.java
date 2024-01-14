package cn.vlife.erp.api;

import cn.vlife.erp.entity.Warehouse;
import cn.vlife.erp.service.WarehouseService;
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
 * 仓库接口 
 */
@RestController
@RequestMapping("/warehouse")
public class WarehouseApi extends VLifeApi<Warehouse, WarehouseService> {
  /**
   * 分页查询仓库
   * @param req 
   * @return 仓库
   */
  @PostMapping("/page")
  public PageVo<Warehouse> page(@RequestBody PageQuery req) {
    return service.findPage(req);
  }

  /**
   * 保存仓库
   * @param warehouse 仓库
   * @return 仓库
   */
  @PostMapping("/save")
  public Warehouse save(@RequestBody Warehouse warehouse) {
    return service.save(warehouse);
  }

  /**
   * 明细查询仓库
   * @param id 主键id
   * @return 仓库
   */
  @GetMapping("/detail/{id}")
  public Warehouse detail(@PathVariable String id) {
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
