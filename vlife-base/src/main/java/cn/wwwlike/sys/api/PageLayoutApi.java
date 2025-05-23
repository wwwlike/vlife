package cn.wwwlike.sys.api;


import cn.wwwlike.sys.dto.PageConfDto;
import cn.wwwlike.sys.entity.PageLayout;
import cn.wwwlike.common.VLifeApi;
import java.lang.String;
import java.util.List;

import cn.wwwlike.sys.service.PageLayoutService;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 自创页面
 */
@RestController
@RequestMapping("/pageLayout")
public class PageLayoutApi extends VLifeApi<PageLayout, PageLayoutService> {
  /**
   * 设计
   */
  @PostMapping("/save/pageConfDto")
  public PageConfDto savePageConfDto(@RequestBody PageConfDto dto) {
    return service.save(dto,true);
  }
  /**
   * 明细查询页面布局
   * 根据页面路由地址或者id
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
   * 查询
   */
  @PostMapping("/list/all")
  public List<PageConfDto> listAll(@RequestBody VlifeQuery<PageLayout> req){
    return service.query(PageConfDto.class,req);
  }
}
