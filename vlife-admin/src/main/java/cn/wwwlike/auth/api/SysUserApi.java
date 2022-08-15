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
import cn.wwwlike.vlife.query.req.VlifeQuery;
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
    //获得菜单专属的权限资源合并到vo里
    if(vo.getMenus()!=null&&vo.getMenus().size()>0){
      List<SysResources> list=resourcesService.findMenuResources(vo.getMenus().toArray(new String[vo.getMenus().size()]));
      if(list!=null)
        vo.getResourceCodes().addAll(list.stream().map(SysResources::getCode).collect(Collectors.toList()));
    }
    return vo;

  }

}
