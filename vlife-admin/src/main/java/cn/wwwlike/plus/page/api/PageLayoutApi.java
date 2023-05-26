package cn.wwwlike.plus.page.api;

import cn.wwwlike.auth.entity.SysResources;

import cn.wwwlike.plus.page.dto.PageConfDto;
import cn.wwwlike.plus.page.entity.PageLayout;
import cn.wwwlike.plus.page.service.PageLayoutService;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.List;

import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 页面布局接口;
 */
@RestController
@RequestMapping("/pageLayout")
public class PageLayoutApi extends VLifeApi<PageLayout, PageLayoutService> {

  /**
   * 页面布局保存
   */
  @PostMapping("/save/pageConfDto")
  public PageConfDto savePageConfDto(@RequestBody PageConfDto dto) {
    return service.save(dto,true);
  }

  /**
   * 明细查询页面布局;
   * @param urlOrId 页面路由地址或者id
   * @return 页面布局;
   */
  @GetMapping("/detail/{urlOrId}")
  public PageConfDto detail(@PathVariable String urlOrId) {
    PageConfDto dto=service.queryOne(PageConfDto.class,urlOrId);
    if(dto!=null){
      return dto;
    }
    VlifeQuery<PageLayout> req=new VlifeQuery<PageLayout>(PageLayout.class);
    req.qw().eq("url",urlOrId);
    List<PageConfDto> dtos=service.query(PageConfDto.class,req);
    if(dtos.size()>0){
      return dtos.get(0);
    }else{
      return null;
    }
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

  /**
   * 全量数据
   */
  @GetMapping("/list/all")
  public List<PageLayout> listAll(){
    return service.findAll();
  }
}
