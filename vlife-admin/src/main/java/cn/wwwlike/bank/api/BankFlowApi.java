package cn.wwwlike.bank.api;

import cn.wwwlike.bank.entity.BankFlow;
import cn.wwwlike.bank.req.BankFlowPageReq;
import cn.wwwlike.bank.service.BankFlowService;
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
 * 业务流水接口;
 */
@RestController
@RequestMapping("/bankFlow")
public class BankFlowApi extends VLifeApi<BankFlow, BankFlowService> {
  /**
   * 分页查询业务流水;
   * @param req 业务流水(视图);
   * @return 业务流水;
   */
  @GetMapping("/page")
  public PageVo<BankFlow> page(BankFlowPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存业务流水;
   * @param dto 业务流水;
   * @return 业务流水;
   */
  @PostMapping("/save")
  public BankFlow save(@RequestBody BankFlow dto) {
    return service.save(dto);
  }

  /**
   * 明细查询业务流水;
   * @param id 主键id;
   * @return 业务流水;
   */
  @GetMapping("/detail/{id}")
  public BankFlow detail(@PathVariable String id) {
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
