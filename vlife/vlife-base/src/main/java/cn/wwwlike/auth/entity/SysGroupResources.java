package cn.wwwlike.auth.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

//权限与资源关联
@Table
@Data
@Entity
public class SysGroupResources extends DbEntity {
    public String sysGroupId;
    public String sysResourcesId;
    public String sysMenuId;
}
