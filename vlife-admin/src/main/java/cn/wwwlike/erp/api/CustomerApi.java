package cn.wwwlike.erp.api;

import cn.wwwlike.erp.dto.CustomerDto;
import cn.wwwlike.erp.entity.Customer;
import cn.wwwlike.erp.req.CustomerPageReq;
import cn.wwwlike.erp.service.CustomerService;
import cn.wwwlike.erp.vo.CustomerVo;
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
 * 客户接口;
 */
@RestController
@RequestMapping("/customer")
public class CustomerApi extends VLifeApi<Customer, CustomerService> {
  /**
   * 分页查询客户;
   * @param req 客户查询;
   * @return 客户;
   */
  @GetMapping("/page")
  public PageVo<Customer> page(CustomerPageReq req) {
    return service.findPage(req);
  }


  @GetMapping("/page/customerVo")
  public PageVo<CustomerVo> pageCustomerVo(CustomerPageReq req) {
    return service.queryPage(CustomerVo.class,req);
  }
  /**
   * 保存客户信息登记;
   * @param dto 客户信息登记;
   * @return 客户信息登记;
   */
  @PostMapping("/save/customerDto")
  public CustomerDto saveCustomerDto(@RequestBody CustomerDto dto) {
    return service.save(dto);
  }


  @PostMapping("/save")
  public Customer save(@RequestBody Customer dto) {
    return service.save(dto);
  }

  /**
   * 明细查询客户;
   * @param id 主键id;
   * @return 客户;
   */
  @GetMapping("/detail/{id}")
  public Customer detail(@PathVariable String id) {
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
