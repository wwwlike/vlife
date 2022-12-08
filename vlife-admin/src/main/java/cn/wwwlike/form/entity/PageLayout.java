package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 页面布局
 */
@Entity
@Data
@Table(name="page_layout")
public class PageLayout extends DbEntity {
    /**
     * 页面名称
     */
    public String name;
    /**
     * 对应权限组
     * 为某权限组配置的页面
     */
    public String sysGroupId;
    /**
     * 对应用户
     * 为某一用户配置的页面
     */
    public String sysUserId;
}
