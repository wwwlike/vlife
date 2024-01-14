package cn.vlife.erp.api;

import cn.vlife.erp.entity.LinkMan;
import cn.vlife.erp.req.LinkManPageReq;
import cn.vlife.erp.service.LinkManService;
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
 * 联系人接口 
 */
@RestController
@RequestMapping("/linkMan")
public class LinkManApi extends VLifeApi<LinkMan, LinkManService> {
  /**
   * 分页查询联系人
   * @param req 联系人查询
   * @return 联系人
   */
  @PostMapping("/page")
  public PageVo<LinkMan> page(@RequestBody LinkManPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存联系人
   * @param linkMan 联系人
   * @return 联系人
   */
  @PostMapping("/save")
  public LinkMan save(@RequestBody LinkMan linkMan) {
    return service.save(linkMan);
  }

  /**
   * 明细查询联系人
   * @param id 主键id
   * @return 联系人
   */
  @GetMapping("/detail/{id}")
  public LinkMan detail(@PathVariable String id) {
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
