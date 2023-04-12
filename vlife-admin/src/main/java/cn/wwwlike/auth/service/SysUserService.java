package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysUserDao;
import cn.wwwlike.auth.dto.RegisterDto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    /**
     * 创建一个用户信息来源于gitee
     * @return
     */
    public void saveUserByregister(RegisterDto register){
        SysUser user=new SysUser();
        user.setEmail(register.getEmail());
        user.setUsername(register.getEmail());
        user.setState("1");
        user.setPassword(new MessageDigestPasswordEncoder("MD5").encode(register.getPassword()));
        user.setSysGroupId("super");
        user.setSysDeptId("4028b8818747df52018747dfdf780000");
        user.setName(register.getEmail());
        save(user);
        user.setCreateId(user.getId());
        save(user);
    }


}
