package cn.wwwlike.auth.entity;

import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.entity.ReportCondition;
import cn.wwwlike.sys.entity.SysResources;
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
@VClazz(orders = "code_asc",clear ={Form.class, SysResources.class},remove = {SysGroupResources.class, ReportCondition.class})//删除应用的时候删除角色
public class SysMenu extends DbEntity implements ITree {
    /**
     * 应用
     */
    public boolean app;
    /**
     * 应用标识
     */
    public String appKey;
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
     * 访问路由
     * 路由信息在router/index.tsx里定义
     */
    public String url;
    /**
     * 变量标识
     * 替换当前路由地址`*`号部分
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
     * 关联角色
     *
     */
    public String sysRoleId;
    /**
     * 自定义页面
     * 菜单是否连接到页面
     */
    public Boolean confPage;
    /**
     * 页面
     */
    public String pageLayoutId;
    /**
     * 实体模型
     * 关联后则可为其分配接口权限
     */
    public String formId;
}
