package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 系统设置
 */
@Entity
@Data
@Table
public class SysVar extends DbEntity {
    //平台名称
    public String name;
    //重置密码
    public String resetPwd;
    //图标
    public String icon;

}
