package cn.wwwlike.auth.service;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dao.SysUserDao;
import cn.wwwlike.auth.dto.RegisterDto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SysUserService extends BaseService<SysUser, SysUserDao> implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<SysUser> users=find("username",username);
        if(users==null||users.size()==0){
            throw new UsernameNotFoundException(username+"is not exist");
        }else{
            SysUser user=users.get(0);
            UserDetailVo detailVo=queryOne(UserDetailVo.class,user.getId());
            SecurityUser securityUser = new SecurityUser(user.getId(),
                    user.getUsername(),user.getPassword(),user.getSysGroupId()
            );
            securityUser.setSysUser(detailVo);
            securityUser.setGroupId(user.getSysGroupId());
            return securityUser;
        }
    }

    public SecurityUser getSecurityUser(SysUser user){
        UserDetailVo detailVo=queryOne(UserDetailVo.class,user.getId());
       SecurityUser securityUser = new SecurityUser(user.getId(),
                user.getUsername(),user.getPassword(),user.getSysGroupId()
        );
        securityUser.setSysUser(detailVo);
        securityUser.setGroupId(user.getSysGroupId());
        return securityUser;
    }
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysGroupService groupService;

    @Autowired
    public SysMenuService menuService;

    /**
     * 用户在客户端里需要的所有详情信息
     */
    public UserDetailVo getUserDetailVo(SecurityUser currUser){
        UserDetailVo vo = queryOne(UserDetailVo.class, currUser.getId());
        List<String> codes =null;
        //资源补充
        if(currUser.getGroupId().equals("super")){
            //超级用户给所有权限
            codes = resourcesService.findApiResources().stream().map(t->t.getCode()).collect(Collectors.toList());
            vo.setMenus(menuService.findAll());//所有菜单
        }else{
            //补充资源所在菜单里的必备资源
             codes = groupService.findGroupResourceCodes(vo.getSysGroupId());
             vo.setMenus(menuService.findAllMenusByResources(
                     codes==null?null:
                     resourcesService.findByIds(
                     codes.toArray(new String[0]))));
        }
        vo.setResourceCodes(codes);


        return vo;
    }

    public static String encode(String str)  {
        return  new MessageDigestPasswordEncoder("MD5").encode(str);
//        MessageDigest md5 = null;
//        try {
//            md5 = MessageDigest.getInstance("MD5");
//            byte[] bytes = md5.digest(str.getBytes("UTF-8"));
//            return Base64.getEncoder().encodeToString(bytes);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return str;
    }
    /**
     * 创建一个用户信息来源于gitee
     * @return
     */
    public void saveUserByregister(RegisterDto register){
        SysUser user=new SysUser();
        user.setEmail(register.getEmail());
        user.setUsername(register.getEmail());
        user.setState("1");
        user.setPassword(encode(register.getPassword()));
        user.setSysGroupId("super");
        user.setSysDeptId("4028b8818747df52018747dfdf780000");
        user.setName(register.getEmail());
        save(user);
        user.setCreateId(user.getId());
        save(user);
    }


}
