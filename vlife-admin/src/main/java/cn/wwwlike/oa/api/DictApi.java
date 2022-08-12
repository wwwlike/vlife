package cn.wwwlike.oa.api;

import cn.wwwlike.auth.req.DictPageReq;
import cn.wwwlike.oa.entity.Dict;
import cn.wwwlike.oa.service.DictService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 字典表接口;
 */
@RestController
@RequestMapping("/dict")
public class DictApi extends VLifeApi<Dict, DictService> {

  @GetMapping("/page")
  public PageVo<Dict> page(DictPageReq req){
    if(req.getQueryType()!=null){
      req.qw(Dict.class).isNull(req.getQueryType()==true,"val")
              .isNotNull(req.getQueryType()==false,"val");
    }
    return service.findPage(req);
  }


  @GetMapping("/all")
  public List<Dict> all(){
    return service.findAll();
  }

  @GetMapping("/all1")
  public List<Dict> all1(){
    return service.findAll();
  }

  /**
   * 保存字典表;
   * @param dto 字典表;
   * @return 字典表;
   */
  @PostMapping("/save")
  public Dict save(@RequestBody Dict dto) {
    return service.save(dto);
  }

  /**
   * 明细查询字典表;
   * @param id 主键id;
   * @return 字典表;
   */
  @GetMapping("/detail/{id}")
  public Dict detail(@PathVariable String id) {
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

  @GetMapping("/sync")
  public List<Dict> sync() {
    return service.sync();
  }

}
