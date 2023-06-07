package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dto.RegisterDto;
import cn.wwwlike.auth.dto.UserPasswordModifyDto;
import cn.wwwlike.auth.dto.UserStateDto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.req.SysUserPageReq;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.auth.service.ThirdLoginService;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.auth.vo.UserVo;
import cn.wwwlike.sys.service.SysAreaService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.apache.commons.lang3.RandomUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户表接口;
 */
@RestController
@RequestMapping("/sysUser")
public class


SysUserApi extends VLifeApi<SysUser, SysUserService> {
    @Autowired
    public SysResourcesService resourcesService;

    @Autowired
    public SysAreaService sysAreaService;
    @Autowired
    public SysGroupService groupService;
    @Autowired
    public ThirdLoginService loginService;

    /**
     * 分页查询用户表(视图);
     *
     * @param req 用户表(视图);
     * @return 用户表(视图);
     */
    @GetMapping("/page/userVo")
    public PageVo<UserVo> pageUser(SysUserPageReq req) {
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
    public boolean saveUserPasswordModifyDto(@RequestBody UserPasswordModifyDto dto) {
       SysUser user=service.findOne(dto.getId());
       CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(new MessageDigestPasswordEncoder("MD5").matches(dto.getPassword(), user.getPassword()),"原密码不正确");
       service.save("password", SysUserService.encode(dto.getNewPassword()),dto.getId());
       return true;
    }

    @GetMapping("/list")
    public List<SysUser> list(SysUserPageReq req) {
        return service.find(req);
    }

    /**
     * 保存用户表;
     *
     * @param dto 用户表;
     * @return 用户表;
     */
    @PostMapping("/save")
    public SysUser save(@RequestBody SysUser dto) {
        if (dto.getPassword() == null && dto.getId() == null) {
            dto.setPassword(SysUserService.encode("123456"));
        }
        if (dto.getState() == null) {
            dto.setState("1");
        }
        return service.save(dto);
    }

    /**
     * 明细查询用户表(视图);
     *
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
     *
     * @param id 主键id;
     * @return 已删除数量;
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }


    /**
     * 返回当前用户信息
     *
     * @return
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
//        sysAreaService.initCode();
        return service.find("email",email).size();
    }

    //key->email  | object[]-> time,code,ip
    public static Map<String,Object[]> sendMap=new HashMap<String,Object[]>();

    /**
     * 账号注册
     * 返回null表示注册成功
     */
    @PostMapping("/register")
    public String register(@RequestBody RegisterDto registerDto){
        if(loginService.openCheckCode()){
            if(sendMap.get(registerDto.getEmail())==null){
                return "还没有给该邮箱发送验证码";
            } else if(!sendMap.get(registerDto.getEmail())[1].toString().equals(registerDto.getCheckCode())){
                return "验证码不正确";
            }
        }
        service.saveUserByregister(registerDto);
        return null;
    }

    /**
     * 检查邮箱唯一性
     */
    @GetMapping("/sendEmail")
    public String sendEmail(String email){
        if(checkEmail(email)==0){
            Object[] sendObjs= sendMap.get(email);
            if(sendObjs==null||DateUtils.addMilliseconds(((Date)sendObjs[0]),1).before(new Date())){
                String checkCode= RandomUtils.nextInt(1000,9999)+"";
                sendMap.put(email,new Object[]{new Date(),checkCode,});
                return loginService.sendMail(email,checkCode);
            }else if(DateUtils.addMilliseconds(((Date)sendObjs[0]),1).after(new Date())){
                return "请不要频繁发送";
            }
        }else{
            return "邮箱已经注册，发送失败";
        }
        return "";
    }

    /**
     * 更新用户状态
     * @param dto
     * @return
     */
    @PostMapping("/state")
    public List<String> state(@RequestBody UserStateDto dto){
        return service.save("state",dto.getState(),dto.getIds().toArray(new String[dto.getIds().size()]));
    }

}
