package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dto.UserPasswordModifyDto;
import cn.wwwlike.auth.dto.UserStateDto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.req.SysUserPageReq;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.auth.vo.UserVo;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 用户表接口;
 */
@RestController
@RequestMapping("/sysUser")
public class SysUserApi extends VLifeApi<SysUser, SysUserService> {
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysGroupService groupService;

    /**
     * 分页查询用户表(视图);
     * @param req 用户表(视图);
     * @return 用户表(视图);
     */
    @GetMapping("/page/userVo")
    public PageVo<UserVo> pageUserVo(SysUserPageReq req) {
        return service.queryPage(UserVo.class, req);
    }

    @GetMapping("/page")
    public PageVo<SysUser> page(SysUserPageReq req) {
        return service.findPage(req);
    }

    /**
     * 密码重置
     * @return
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

    /**
     * 密码修改
     */
    @PostMapping("/save/userPasswordModifyDto")
    public boolean saveUserPasswordModifyDto(@RequestBody UserPasswordModifyDto userPasswordModifyDto) {
       SysUser user=service.findOne(userPasswordModifyDto.getId());
       CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(new MessageDigestPasswordEncoder("MD5").matches(userPasswordModifyDto.getPassword(), user.getPassword()),"原密码不正确");
       service.save("password", SysUserService.encode(userPasswordModifyDto.getNewPassword()),userPasswordModifyDto.getId());
       return true;
    }

    @GetMapping("/list")
    public List<SysUser> list(SysUserPageReq req) {
        return service.find(req);
    }

    /**
     * 保存用户表;
     * @param sysUser 用户表;
     * @return 用户表;
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
        return service.queryOne(UserDetailVo.class, id);
    }

    /**
     * 逻辑删除;
     */
    @DeleteMapping("/remove")
    public Long remove(@RequestBody String[] ids) {
        return service.remove(ids);
    }

    /**
     * 返回当前用户信息
     */
    @GetMapping("/currUser")
    public UserDetailVo currUser() {
       return service.getUserDetailVo( SecurityConfig.getCurrUser());
    }

    /**
     * 检查邮箱唯一性
     */
    @GetMapping("/checkEmail")
    public Integer checkEmail(String email){
        return service.find("email",email).size();
    }

    /**
     * 更新用户状态
     * @param userStateDto
     */
    @PostMapping("/state")
    public List<String> state(@RequestBody UserStateDto userStateDto){
        return service.save("state",userStateDto.getState(),userStateDto.getIds().toArray(new String[userStateDto.getIds().size()]));
    }

    /**
     * 用户工作流(测试)
     */
    @PostMapping("/flow")
    public SysUser flowState(@RequestBody SysUser sysUser){
         service.save("state",sysUser.getState(),sysUser.getId());
         return service.findOne(sysUser.getId());
    }

    /**
     * 查询单个部门的用户
     */
    @GetMapping("/list/all")
    public List<SysUser> listAll(String sysDeptId) {
        if (sysDeptId == null) {
            return new ArrayList<>();
        }
        return service.find(QueryWrapper.of(SysUser.class).eq("code", sysDeptId, SysDept.class));
    }

    @GetMapping("/validate/name")
    public boolean validateName(String str){
        if(str!=null&& str.length()>10||"admin".equals(str)){
            return true;
        }
        return false;
    }
}
