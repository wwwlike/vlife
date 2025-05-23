package cn.wwwlike.sys.entity;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Setter;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 菜单
 */
@Setter
@Entity
@Table(name = "sys_menu")
@VClazz(orders = "code_asc,sort_asc,createDate_asc",clear ={SysResources.class,Form.class},remove = {SysTab.class,Button.class})
public class SysMenu extends DbEntity implements ITree {
    //应用
    public String sysAppId;
    /**
     * 菜单名称
     */
    public String name;
    /**
     * 编码
     * (系统自动生成)
     */
    public String code;
    /**
     * 上级菜单
     */
    public String pcode;
    /**
     * 路由地址
     * 路由信息在router/index.tsx里定义
     */
    public String url;
    //排序号
    public Integer sort;
    //图标
    public String icon;
    //是否系统级
    public Boolean sys;
    //列表模型
    public String formId;
    /**
     * 页面类型
     * 模板|视图|自定义页面
     */
    @VField(dictCode = "PAGE_TYPE")
    public String pageType;
    //图表看板页面
    public String pageLayoutId;

    public String getName() {
        return name;
    }
    public String getCode() {
        return code;
    }
    public String getPcode() {
        return pcode;
    }
    public String getUrl() {
        return url;
    }
    public Integer getSort() {
        return sort;
    }
    public String getIcon() {
        return icon;
    }
    public String getPageType() {
        return pageType;
    }
    public String getPageLayoutId() {
        return pageLayoutId;
    }
    public String getSysAppId() {
        return sysAppId;
    }
    public String getFormId() {
        return formId;
    }
    public Boolean getSys() {
        return sys;
    }
    public void setSys(Boolean sys) {
        this.sys = sys;
    }
//    //业务实体
//    public String entityId;
//    public String getEntityId() {
//        return entityId;
//    }

}
