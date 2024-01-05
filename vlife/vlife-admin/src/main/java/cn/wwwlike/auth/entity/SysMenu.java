package cn.wwwlike.auth.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 菜单
 */
@Data
@Entity
@Table(name = "sys_menu")
@VClazz(orders = "code_asc")
public class SysMenu extends DbEntity implements ITree {
    /**
     * 应用
     */
    public boolean app;
    /**
     * 菜单名称
     */
    public String name;
    /**
     * 编码
     */
    public String code;
    /**
     * 上级菜单
     */
    public String pcode;
    /**
     * 路由地址
     */
    public String url;
    /**
     * 通配符替换
     * url里的*号替换地址
     */
    public String placeholderUrl;
    /**
     * 排序号
     */
    public Integer sort;
    /**
     * 图标
     */
    public String icon;
    /**
     * 模型关联
     * 可快速将相关接口与其关联
     */
    public String entityType;
    /**
     * 归属角色
     * 菜单没有关联就扣则可以和角色绑定进行权限控制
     */
    public String sysRoleId;
    /**
     * 自定义页面
     */
    public Boolean confPage;
    /**
     * 页面地址
     */
    public String pageLayoutId;
    /**
     * 实体模型
     */
    public String formId;
}
