package cn.wwwlike.form.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.form.entity.ReportCondition;
import cn.wwwlike.form.req.ReportConditionPageReq;
import cn.wwwlike.form.service.ReportConditionService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.List;
import java.util.stream.Collectors;

import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 视图配置接口
 */
@RestController
@RequestMapping("/reportCondition")
public class ReportConditionApi extends VLifeApi<ReportCondition, ReportConditionService> {
  /**
   * 视图配置查询
   */
  @PostMapping("/page")
  public PageVo<ReportCondition> page(@RequestBody ReportConditionPageReq req) {
    return service.findPage(req);
  }

  /**
   * 视图配置列表
   * 查询指定数据集视图
   */
  @PostMapping("/list")
  public List<ReportCondition> list(@RequestBody ReportConditionPageReq req) {
    List<ReportCondition> list=service.find(req);
    //非超级管理员的列表视图需要根据权限组过滤
    SecurityUser currUser=SecurityConfig.getCurrUser();
    if("table".equals(req.getType())){
      return list.stream().filter(
              item->(currUser.getSuperUser()!=null&&currUser.getSuperUser())||item.getSysGroupIds()==null||item.getSysGroupIds().indexOf(currUser.getGroupId())!=-1).collect(Collectors.toList());
    }
    return list;
  }

  /**
   * 保存视图配置
   */
  @PostMapping("/save")
  public ReportCondition save(@RequestBody ReportCondition reportCondition) {
    return service.save(reportCondition);
  }

  /**
   * 视图配置详情
   */
  @GetMapping("/detail/{id}")
  public ReportCondition detail(@PathVariable String id) {
    return service.findOne(id);
  }
  /**
   * 视图配置删除
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    return service.remove(ids);
  }
}
