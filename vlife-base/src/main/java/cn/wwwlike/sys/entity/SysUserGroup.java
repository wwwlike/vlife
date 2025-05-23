package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

//用户角色关联
@Data
@Table
@Entity
public class SysUserGroup extends DbEntity {
    //用户
    public String sysUserId;
    //角色
    public String sysGroupId;

}
