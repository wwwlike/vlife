package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 系统变量
 * 前端做数据展示和逻辑处理用到的变量(系统名称，分页数量，系统图标等)
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
