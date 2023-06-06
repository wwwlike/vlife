package cn.wwwlike.bank.api;

import cn.wwwlike.bank.entity.BankBatch;
import cn.wwwlike.bank.req.BankBatchPageReq;
import cn.wwwlike.bank.service.BankBatchService;
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
 * 批次接口;
 */
@RestController
@RequestMapping("/bankBatch")
public class BankBatchApi extends VLifeApi<BankBatch, BankBatchService> {
  /**
   * 分页查询批次;
   * @param req 批次查询;
   * @return 批次;
   */
  @GetMapping("/page")
  public PageVo<BankBatch> page(BankBatchPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存批次;
   * @param dto 批次;
   * @return 批次;
   */
  @PostMapping("/save")
  public BankBatch save(@RequestBody BankBatch dto) {
    return service.save(dto);
  }

  /**
   * 明细查询批次;
   * @param id 主键id;
   * @return 批次;
   */
  @GetMapping("/detail/{id}")
  public BankBatch detail(@PathVariable String id) {
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
