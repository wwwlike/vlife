package cn.wwwlike.sys.vo;

import cn.wwwlike.sys.entity.*;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 页签按钮资源vo
 */
@Data
public class SysTabButtonVo extends VoBean<SysTabButton> {
    public String buttonId;//关联按钮
    public List<SysTabVisit> sysTab_sysTabVisit; //按钮所在页面的授权对象
    public SysResources button_sysResources;  //页签绑定按钮对应的资源信息
}
