package cn.wwwlike.demo.api;

import cn.wwwlike.demo.entity.DemoTask;
import cn.wwwlike.demo.service.DemoTaskService;
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
 * 实体demoTask接口;
 */
@RestController
@RequestMapping("/demoTask")
public class DemoTaskApi extends VLifeApi<DemoTask, DemoTaskService> {
  /**
   * 分页查询实体demoTask;
   * @param req ;
   * @return 实体demoTask;
   */
  @GetMapping("/page")
  public PageVo<DemoTask> page(PageQuery req) {
    return service.findPage(req);
  }

  /**
   * 保存实体demoTask;
   * @param demoTask 实体demoTask;
   * @return 实体demoTask;
   */
  @PostMapping("/save")
  public DemoTask save(@RequestBody DemoTask demoTask) {
    return service.save(demoTask);
  }

  /**
   * 明细查询实体demoTask;
   * @param id 主键id;
   * @return 实体demoTask;
   */
  @GetMapping("/detail/{id}")
  public DemoTask detail(@PathVariable String id) {
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
