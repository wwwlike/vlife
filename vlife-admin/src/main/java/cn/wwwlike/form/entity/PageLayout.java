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
     * 动态路由地址
     */
    public String url;
    /**
     * 是否需要权限登录
     */
    public Boolean auth;
    /**
     * 是否作为模块使用
     */
    public Boolean module;
    /**
     * 页面高度
     */
    public Integer h;

    /**
     * 预览图片
     */
    public String img;

    /**
     * 内部组件支持覆盖
     */
    public Boolean componentOver;
}
