package cn.wwwlike.sys.api;

import cn.wwwlike.sys.dto.SysDeptUserDto;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.req.SysDeptPageReq;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 接口;
 */
@RestController
@RequestMapping("/sysDept")
public class SysDeptApi extends VLifeApi<SysDept, SysDeptService> {
  /**
   * 分页查询null;
   * @param req 部门查询条件;
   * @return null;
   */
  @GetMapping("/page")
  public PageVo<SysDept> page(SysDeptPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存null;
   * @param dto null;
   * @return null;
   */
  @PostMapping("/save")
  public SysDept save(@RequestBody SysDept dto) {
    return service.save(dto);
  }


  @PostMapping("/save/sysDeptUserDto")
  public SysDeptUserDto saveSysDeptUserDto(@RequestBody SysDeptUserDto dto) {
    return service.save(dto,true);
  }

//  @GetMapping("/list/all")
//  public List<SysDept> listAll(String entityName) {
//    QueryWrapper<SysDept> wrapper = QueryWrapper.of(SysDept.class);
//    if(entityName!=null&&!entityName.equals("sysDept")){
//      wrapper.filterRuleClz= GlobalData.entityDto(entityName).getClz();
//    }
//    return service.find(wrapper);
//  }

  @GetMapping("/list/all")
  public List<SysDept> listAll() {
    return service.findAll();
  }
  /**
   * 明细查询null;
   * @param id 主键id;
   * @return null;
   */
  @GetMapping("/detail/{id}")
  public SysDept detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 删除部门;
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
