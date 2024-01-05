package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.req.SysDeptPageReq;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 部门接口
 */
@RestController
@RequestMapping("/sysDept")
public class SysDeptApi extends VLifeApi<SysDept, SysDeptService> {
  /**
   * 部门查询
   */
  @PostMapping("/page")
  public PageVo<SysDept> page(@RequestBody SysDeptPageReq req) {
    return service.findPage(req);
  }
  /**
   * 部门保存
   */
  @PostMapping("/save")
  public SysDept save(@RequestBody SysDept dto) {
   return service.save(dto);
  }
  /**
   * 所有部门
   */
  @GetMapping("/list/all")
  public List<SysDept> listAll() {
    return service.findAll();
  }
  /**
   * 部门详情
   */
  @GetMapping("/detail/{id}")
  public SysDept detail(@PathVariable String id) {
    return service.findOne(id);
  }
  /**
   * 删除部门
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }

}
