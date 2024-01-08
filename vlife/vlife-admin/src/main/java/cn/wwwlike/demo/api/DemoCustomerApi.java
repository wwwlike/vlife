package cn.wwwlike.demo.api;

import cn.wwwlike.demo.entity.DemoCustomer;
import cn.wwwlike.demo.service.DemoCustomerService;
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
 * 甲方客户接口;
 */
@RestController
@RequestMapping("/demoCustomer")
public class DemoCustomerApi extends VLifeApi<DemoCustomer, DemoCustomerService> {
  /**
   * 查询甲方客户list
   * @param req ;
   * @return 甲方客户;
   */
  @PostMapping("/list")
  public List<DemoCustomer> list(@RequestBody PageQuery req) {
    return service.find(req);
  }

  /**
   * 保存甲方客户;
   * @param demoCustomer 甲方客户;
   * @return 甲方客户;
   */
  @PostMapping("/save")
  public DemoCustomer save(@RequestBody DemoCustomer demoCustomer) {
    return service.save(demoCustomer);
  }

  /**
   * 明细查询甲方客户;
   * @param id 主键id;
   * @return 甲方客户;
   */
  @GetMapping("/detail/{id}")
  public DemoCustomer detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
