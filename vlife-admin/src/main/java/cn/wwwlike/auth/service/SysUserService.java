package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysUserDao;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.web.security.filter.PehrSecurityUser;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

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
            PehrSecurityUser securityUser = new PehrSecurityUser(user.getId(),
                    user.getUsername(),user.getPassword(),user.getSysGroupId()
            );
            securityUser.setOrgId(user.getSysOrgId());
            securityUser.setDeptId(user.getSysDeptId());
            securityUser.setGroupId(user.getSysGroupId());
            //vo查询到的部分,间接查询的结构信息
            securityUser.setCodeArea(detailVo.getCodeArea());
            securityUser.setCodeDept(detailVo.getCodeDept());
            securityUser.setCodeOrg(detailVo.getCodeOrg());
            securityUser.setAreaId(detailVo.getSysAreaId());
            return securityUser;
        }
    }
}
