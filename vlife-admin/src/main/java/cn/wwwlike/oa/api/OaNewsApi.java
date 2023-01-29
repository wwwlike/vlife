package cn.wwwlike.oa.api;

import cn.wwwlike.oa.entity.OaNews;
import cn.wwwlike.oa.req.OaNewsPageReq;
import cn.wwwlike.oa.service.OaNewsService;
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
 * null接口;
 */
@RestController
@RequestMapping("/oaNews")
public class OaNewsApi extends VLifeApi<OaNews, OaNewsService> {
  /**
   * 保存null;
   * @param dto null;
   * @return null;
   */
  @PostMapping("/save")
  public OaNews save(@RequestBody OaNews dto) {
    return service.save(dto);
  }

  /**
   * 明细查询null;
   * @param id 主键id;
   * @return null;
   */
  @GetMapping("/detail/{id}")
  public OaNews detail(@PathVariable String id) {
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

  @GetMapping("/page")
  public PageVo<OaNews> page(OaNewsPageReq req){
    return service.findPage(req);
  }
}
