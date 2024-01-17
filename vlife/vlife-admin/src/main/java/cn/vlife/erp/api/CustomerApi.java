package cn.vlife.erp.api;

import cn.vlife.erp.dto.CustomerDto;
import cn.vlife.erp.entity.Customer;
import cn.vlife.erp.req.CustomerPageReq;
import cn.vlife.erp.service.CustomerService;
import cn.vlife.erp.vo.CustomerVo;
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
 * 客户接口 
 */
@RestController
@RequestMapping("/customer")
public class CustomerApi extends VLifeApi<Customer, CustomerService> {
  /**
   * 分页查询客户详情
   * @param req 客户查询
   * @return 客户详情
   */
  @PostMapping("/page")
  public PageVo<Customer> page(@RequestBody CustomerPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存客户信息登记
   * @param customerDto 客户信息登记
   * @return 客户信息登记
   */
  @PostMapping("/save/customerDto")
  public CustomerDto saveCustomerDto(@RequestBody CustomerDto customerDto) {
    return service.save(customerDto);
  }

  /**
   * 明细查询客户详情
   * @param id 主键id
   * @return 客户详情
   */
  @GetMapping("/detail/{id}")
  public CustomerVo detail(@PathVariable String id) {
    return service.queryOne(CustomerVo.class,id);
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
