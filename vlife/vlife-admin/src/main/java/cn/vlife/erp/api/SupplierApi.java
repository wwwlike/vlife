package cn.vlife.erp.api;

import cn.vlife.erp.dto.SupplierDto;
import cn.vlife.erp.entity.Supplier;
import cn.vlife.erp.req.SupplierPageReq;
import cn.vlife.erp.service.SupplierService;
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
 * 供应商接口 
 */
@RestController
@RequestMapping("/supplier")
public class SupplierApi extends VLifeApi<Supplier, SupplierService> {
  /**
   * 分页查询供应商
   * @param req 供应商查询
   * @return 供应商
   */
  @PostMapping("/page")
  public PageVo<Supplier> page(@RequestBody SupplierPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存供应商信息登记
   * @param supplierDto 供应商信息登记
   * @return 供应商信息登记
   */
  @PostMapping("/save/supplierDto")
  public SupplierDto saveSupplierDto(@RequestBody SupplierDto supplierDto) {
    return service.save(supplierDto);
  }

  /**
   * 明细查询供应商
   * @param id 主键id
   * @return 供应商
   */
  @GetMapping("/detail/{id}")
  public Supplier detail(@PathVariable String id) {
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
