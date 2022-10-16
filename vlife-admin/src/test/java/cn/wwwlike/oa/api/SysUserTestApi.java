package cn.wwwlike.oa.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.req.SysUserPageReq;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.auth.vo.UserVo;
import cn.wwwlike.oa.vo.UserInfo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/sysUserTest")
public class SysUserTestApi extends VLifeApi<SysUser, SysUserService> {
  @Autowired
  public SysResourcesService resourcesService;

  @GetMapping("/detail/userInfo/{id}")
  public UserInfo userInfoDetail(@PathVariable String id) {
    return service.queryOne(UserInfo.class,id);
  }

}
