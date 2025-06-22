package cn.wwwlike.sys.api;

import cn.wwwlike.sys.dto.UserPasswordModifyDto;
import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.sys.entity.SysVar;
import cn.wwwlike.sys.service.SysUserService;
import cn.wwwlike.sys.service.SysVarService;
import cn.wwwlike.sys.vo.UserDetailVo;
import cn.wwwlike.sys.dto.UserDataMoveDto;
import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

/**
 * 用户接口
 */
@RestController
@RequestMapping("/sysUser")
public class SysUserApi extends VLifeApi<SysUser, SysUserService> {
    @Autowired
    public SysVarService varService;
    /**
     * 密码重置
     */
    @PostMapping("/reset")
    public Integer reset(@RequestBody String[] ids) {
        List<SysUser> users=service.findByIds(ids);
        SysVar var=varService.findAll().get(0);
        for(SysUser user:users) {
            user.setPassword(SysUserService.encode(var.getResetPwd()==null?"123456":var.getResetPwd()));
            service.save(user);
        }
        return ids.length;
    }

    /**
     * 密码修改
     */
    @PostMapping("/save/userPasswordModifyDto")
    @VMethod(permission = PermissionEnum.noAuth)
    public UserPasswordModifyDto saveUserPasswordModifyDto(@RequestBody UserPasswordModifyDto userPasswordModifyDto) {
       SysUser user=service.findOne(userPasswordModifyDto.getId());
       CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(userPasswordModifyDto.getId().equals(SecurityConfig.getCurrUser().getId()),"只能修改自己的账号");
       CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(new MessageDigestPasswordEncoder("MD5").matches(userPasswordModifyDto.getPassword(), user.getPassword()),"原密码不正确");
       service.save("password", SysUserService.encode(userPasswordModifyDto.getNewPassword()),userPasswordModifyDto.getId());
       return userPasswordModifyDto;
    }

    /**
     * 信息修改
     */
    @PostMapping("/save/self")
    @VMethod(permission = PermissionEnum.noAuth)
    public SysUser saveSelf(@RequestBody SysUser dto) {
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getId().equals(SecurityConfig.getCurrUser().getId()),"只能修改自己的账号");
        return service.save(dto);
    }

    /**
     * 数据迁移
     */
    @PostMapping("/move")
    public UserDataMoveDto move(@RequestBody UserDataMoveDto dto) {
        for(String sourceId:dto.getIds()){
            service.dataMove(sourceId,dto.getTargetUserId());
        }
        return dto;
    }

    /**
     * 当前用户
     */
    @VMethod(permission = PermissionEnum.noAuth)
    @GetMapping("/currUser")
    public UserDetailVo currUser() {
       return service.getUserDetailVo( SecurityConfig.getCurrUser());
    }


}
