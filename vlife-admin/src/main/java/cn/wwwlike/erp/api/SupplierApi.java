package cn.wwwlike.erp.api;

import cn.wwwlike.erp.dto.SupplierDto;
import cn.wwwlike.erp.entity.Supplier;
import cn.wwwlike.erp.req.SupplierPageReq;
import cn.wwwlike.erp.service.SupplierService;
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
 * 供应商接口;
 */
@RestController
@RequestMapping("/supplier")
public class SupplierApi extends VLifeApi<Supplier, SupplierService> {
  /**
   * 分页查询供应商;
   * @param req 供应商查询;
   * @return 供应商;
   */
  @GetMapping("/page")
  public PageVo<Supplier> page(SupplierPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存供应商&联系人集合dto;
   * @param dto 供应商&联系人集合dto;
   * @return 供应商&联系人集合dto;
   */
  @PostMapping("/save/supplierDto")
  public SupplierDto saveSupplierDto(@RequestBody SupplierDto dto) {
    return service.save(dto,true);
  }

  @PostMapping("/save")
  public Supplier saveSupplierDto(@RequestBody Supplier dto) {
    return service.save(dto);
  }

  /**
   * 明细查询供应商;
   * @param id 主键id;
   * @return 供应商;
   */
  @GetMapping("/detail/{id}")
  public Supplier detail(@PathVariable String id) {
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
