package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.Dept;
import cn.wwwlike.oa.service.DeptService;
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
 * 部门接口;
 */
@RestController
@RequestMapping("/dept")
public class DeptApi extends VLifeApi<Dept, DeptService> {
  /**
   * 保存部门;
   * @param dto 部门;
   * @return 部门;
   */
  @PostMapping("/save")
  public Dept save(@RequestBody Dept dto) {
    return service.save(dto);
  }

  /**
   * 明细查询部门;
   * @param id 主键id;
   * @return 部门;
   */
  @GetMapping("/detail/{id}")
  public Dept detail(@PathVariable String id) {
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
