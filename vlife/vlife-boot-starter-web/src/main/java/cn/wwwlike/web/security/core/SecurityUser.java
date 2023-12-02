package cn.wwwlike.web.security.core;
import cn.wwwlike.vlife.base.IUser;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

/**
 * 暴露和权限相关的内容在这个里面
 */
@Data
public class SecurityUser implements UserDetails, IUser {
    protected  String id; //用户id
    protected String username; //用户名
    protected String password;
    protected String groupId;//权限组
    public Object useDetailVo;//用户综合信息
    public SecurityUser(){
    }

    /**
     * 用户拥有的基本属性
     * @param id 记录id
     * @param username 用户名
     * @param authoritie 权限标识
     */
    public SecurityUser(String id,String username,String password,String authoritie) {
       this.username=username;
       this.password=password;
       this.id=id;
       this.groupId=authoritie;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        ArrayList<GrantedAuthority> list=new ArrayList();
        if(this.getGroupId()!=null){
            list.add(new SimpleGrantedAuthority(this.getGroupId()));
        }
        return list;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setUsername(String username) {
        this.username = username;
    }


}
