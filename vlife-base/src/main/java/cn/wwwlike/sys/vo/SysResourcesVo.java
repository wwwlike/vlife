package cn.wwwlike.sys.vo;

import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;
//权限视图
@Data
public class SysResourcesVo extends VoBean<SysResources> {
    //应用key
    public String form_sysApp_appKey;

    public String paramType;

    public String permission;

    public String url;

}
