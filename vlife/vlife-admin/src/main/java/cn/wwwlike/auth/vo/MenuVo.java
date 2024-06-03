package cn.wwwlike.auth.vo;
import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;
import lombok.Setter;

import java.util.List;

@Setter
@VClazz(orders = "sort_asc")
public class MenuVo implements VoBean<SysMenu> {
    public String id;
    public String name;
    public String code;
    public String pcode;
    public String url;
    public Integer sort;
    public String icon;
    public boolean app;
    public String sysRoleId;
    public String formId;
    public String placeholderUrl;

    //路由地址
    @VField(skip = true)
    public String routerAddress;
    /**
     * 应用角色
     */
    public List<SysRole> roleList;
    /**
     * 权限列表
     */
    public List<SysResources> sysResourcesList;


    @Override
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPcode() {
        return pcode;
    }

    public void setPcode(String pcode) {
        this.pcode = pcode;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public boolean isApp() {
        return app;
    }

    public void setApp(boolean app) {
        this.app = app;
    }

    public String getSysRoleId() {
        return sysRoleId;
    }

    public void setSysRoleId(String sysRoleId) {
        this.sysRoleId = sysRoleId;
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public String getPlaceholderUrl() {
        return placeholderUrl;
    }

    public void setPlaceholderUrl(String placeholderUrl) {
        this.placeholderUrl = placeholderUrl;
    }

    public String getRouterAddress() {
        if(getUrl()!=null){
            if(getUrl().endsWith("*")){
                return getUrl().replaceAll("\\*$", placeholderUrl);
            }
            return  getUrl();
        }
        return routerAddress;
    }

    public void setRouterAddress(String routerAddress) {
        this.routerAddress = routerAddress;
    }

    public List<SysRole> getRoleList() {
        return roleList;
    }

    public void setRoleList(List<SysRole> roleList) {
        this.roleList = roleList;
    }

    public List<SysResources> getSysResourcesList() {
        return sysResourcesList;
    }

    public void setSysResourcesList(List<SysResources> sysResourcesList) {
        this.sysResourcesList = sysResourcesList;
    }

}
