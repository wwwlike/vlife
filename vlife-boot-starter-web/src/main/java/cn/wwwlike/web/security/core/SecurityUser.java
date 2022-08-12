package cn.wwwlike.web.security.core;
import cn.wwwlike.base.model.IUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

/**
 * 暴露和权限相关的内容在这个里面
 */
public class SecurityUser implements UserDetails, IUser {
    protected  String id; //用户id
    protected String username; //用户名
    protected String password; //登录密码？ 这个需要放在系统里么
    protected String authoritie;
    public SecurityUser(){
    }

    /**
     * 用户拥有的基本属性
     * @param id 记录id
     * @param username 用户名
     * @param password  密码
     * @param authoritie 权限标识
     */
    public SecurityUser(String id,String username,String password,String authoritie) {
       this.password=password;
       this.username=username;
       this.id=id;
       this.authoritie=authoritie;
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
        if(this.authoritie!=null){
            list.add(new SimpleGrantedAuthority(this.authoritie));
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

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAuthoritie() {
        return authoritie;
    }

    public void setAuthoritie(String authoritie) {
        this.authoritie = authoritie;
    }
}
