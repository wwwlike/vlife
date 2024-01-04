package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dto.UserPasswordModifyDto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.req.SysUserPageReq;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * 用户接口
 */
@RestController
@RequestMapping("/sysUser")
public class SysUserApi extends VLifeApi<SysUser, SysUserService> {
    @Autowired
    public SysResourcesService resourcesService;
    /**
     * 用户查询
     */
    @PostMapping("/page")
    public PageVo<SysUser> page(@RequestBody SysUserPageReq req) {
        return service.findPage(req);
    }
    /**
     * 密码重置
     */
    @PostMapping("/reset")
    public Integer reset(@RequestBody String[] ids) {
        List<SysUser> users=service.findByIds(ids);
        for(SysUser user:users) {
            user.setPassword(SysUserService.encode("123456"));
            service.save(user);
        }
        return ids.length;
    }
    //
    /**
     * 密码修改
     */
    @PostMapping("/save/userPasswordModifyDto")
    @VMethod(permission = PermissionEnum.single)
    public boolean saveUserPasswordModifyDto(@RequestBody UserPasswordModifyDto userPasswordModifyDto) {
       SysUser user=service.findOne(userPasswordModifyDto.getId());
       CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(new MessageDigestPasswordEncoder("MD5").matches(userPasswordModifyDto.getPassword(), user.getPassword()),"原密码不正确");
       service.save("password", SysUserService.encode(userPasswordModifyDto.getNewPassword()),userPasswordModifyDto.getId());
       return true;
    }
    /**
     * 用户保存
     */
    @PostMapping("/save")
    public SysUser save(@RequestBody SysUser sysUser) {
        if (sysUser.getPassword() == null && sysUser.getId() == null) {
            sysUser.setPassword(SysUserService.encode("123456"));
        }
        if (sysUser.getState() == null) {
            sysUser.setState("1");
        }
        return service.save(sysUser);
    }
    /**
     * 用户详情
     */
    @GetMapping("/detail/{id}")
    public SysUser detail(@PathVariable String id) {
        return service.findOne(id);
    }
    /**
     * 用户删除
     */
    @DeleteMapping("/remove")
    public Long remove(@RequestBody String[] ids) {
        return service.remove(ids);
    }
    /**
     * 当前用户
     */
    @VMethod(permission = PermissionEnum.noAuth)
    @GetMapping("/currUser")
    public UserDetailVo currUser() {
       return service.getUserDetailVo( SecurityConfig.getCurrUser());
    }
    /**
     * 邮箱唯一性校验
     */
    @VMethod(permission = PermissionEnum.noAuth)
    @GetMapping("/checkEmail")
    public Integer checkEmail(String email){
        return service.find("email",email).size();
    }
    /**
     * 启用停用
     * 单条记录启用停用
     */
    @PostMapping("/state")
    public SysUser state(String state,String id){
         service.save("state",state,id);
         return service.findOne(id);
    }
}
