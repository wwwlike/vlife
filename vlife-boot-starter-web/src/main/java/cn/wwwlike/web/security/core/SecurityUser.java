package cn.wwwlike.web.security.core;
import cn.wwwlike.vlife.base.IUser;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 暴露和权限相关的内容在这个里面
 */
public class SecurityUser implements UserDetails, IUser {
    protected  String id; //用户id
    protected String username; //用户名
    protected String password;
    protected List<String> groupIds;//角色
    protected String deptId;//部门id
    protected String deptCode;//部门code
    protected Boolean superUser;//是否是超级管理员
    protected String defaultLevel; //默认查询级别
    public SecurityUser(){
    }

    /**
     * 用户拥有的基本属性
     */
    public SecurityUser(String id,String username,String password,String deptId,String deptCode,List<String> groupIds,String dataLevel) {
       this.username=username;
       this.password=password;
       this.id=id;
       this.deptId=deptId;
       this.deptCode=deptCode;
       this.groupIds=groupIds;
       this.defaultLevel=dataLevel;
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
        if(this.getGroupIds()!=null){
            for(String groupId:this.getGroupIds()){
                list.add(new SimpleGrantedAuthority(groupId));
            }
            list.add(new SimpleGrantedAuthority("ROLE_ACTIVITI_USER"));
        }
        //
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

    public String getDeptId() {
        return deptId;
    }

    public String getDeptCode() {
        return deptCode;
    }

    public Boolean getSuperUser() {
        return superUser;
    }

//    public Object getUseDetailVo() {
//        return useDetailVo;
//    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setGroupIds(List<String> groupIds) {
        this.groupIds = groupIds;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }

    public void setSuperUser(Boolean superUser) {
        this.superUser = superUser;
    }

    public String getDefaultLevel() {
        return defaultLevel;
    }

    public void setDefaultLevel(String defaultLevel) {
        this.defaultLevel = defaultLevel;
    }

    public List<String> getGroupIds() {
        return groupIds;
    }
}
