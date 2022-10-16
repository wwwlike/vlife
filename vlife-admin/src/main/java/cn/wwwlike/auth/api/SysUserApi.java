package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.req.SysUserPageReq;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.auth.vo.UserVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户表接口;
 */
@RestController
@RequestMapping("/sysUser")
public class SysUserApi extends VLifeApi<SysUser, SysUserService> {
  @Autowired
  public SysResourcesService resourcesService;
  /**
   * 分页查询用户表(视图);
   * @param req 用户表(视图);
   * @return 用户表(视图);
   */
  @GetMapping("/page/userVo")
  public PageVo<UserVo> pageUser(SysUserPageReq req) {
    return service.queryPage(UserVo.class,req);
  }

  @GetMapping("/page")
  public PageVo<SysUser> page(SysUserPageReq req) {
    return service.findPage(req);
  }

  /**
   * 保存用户表;
   * @param dto 用户表;
   * @return 用户表;
   */
  @PostMapping("/save")
  public SysUser save(@RequestBody SysUser dto) {
    if(dto.getPassword()==null&&dto.getId()==null){
      //初始化123456密码
      dto.setPassword("{F4T9t2BE3HCvD9khLCxL/nyib/AdM1WqR/tMx5eJJ2k=}f0afa783ba7607063606fdb43c2e55fb");
    }
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
    SysUser user=service.findOne(vo.getId());
    user.setLoginNum(user.getLoginNum()==null?1:user.getLoginNum()+1);
    service.save(user);
    //资源的上级资源加入到codes里
    List<String> codes=vo.getResourceCodes();
    if(vo.getResourceCodes()!=null){
      vo.setResourceCodes(
              resourcesService.findApiResources(
                      resourcesService.findAll(),
                      codes.toArray(new String[codes.size()])).stream()
                      .map(SysResources::getResourcesCode)
                      .collect(Collectors.toList()));
    }
    return vo;
  }

}
