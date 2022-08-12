package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.req.UserPageReq;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.auth.vo.UserVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;

import org.apache.catalina.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户表接口;
 */
@RestController
@RequestMapping("/sysUser")
public class SysUserApi extends VLifeApi<SysUser, SysUserService> {
  /**
   * 分页查询用户表(视图);
   * @param req 用户表(视图);
   * @return 用户表(视图);
   */
  @GetMapping("/page/userVo")
  public PageVo<UserVo> pageUser(UserPageReq req) {
    return service.queryPage(UserVo.class,req);
  }

  @GetMapping("/page")
  public PageVo<SysUser> page(UserPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存用户表;
   * @param dto 用户表;
   * @return 用户表;
   */
  @PostMapping("/save")
  public SysUser save(@RequestBody SysUser dto) {
    return service.save(dto);
  }

  /**
   * 明细查询用户表(视图);
   * @param id 主键id;
   * @return 用户表(视图);
   */
  @GetMapping("/detail/{id}")
  public SysUser detail(@PathVariable String id) {
    return service.findOne(id);
  }

  @GetMapping("/detail/userDetailVo/{id}")
  public UserDetailVo usesrDetailVoDetail(@PathVariable String id) {
    return service.queryOne(UserDetailVo.class,id);
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
   * 返回当前用户信息
   * @return
   */
  @GetMapping("/currUser")
  public UserDetailVo currUser(){
    UserDetailVo vo=service.queryOne(UserDetailVo.class, SecurityConfig.getCurrUser().getId());
    return vo;
  }

}
