package cn.wwwlike.auth.vo;

import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

@Data
public class MenuVo implements VoBean<SysMenu> {
    public String id;
    /**
     * 菜单名称
     */
    public String name;
    /**
     * 编码
     */
    public String code;
    /**
     * 上级菜单编码
     */
    public String pcode;
    /**
     * 路由地址
     * 叶子菜单必须有url
     */
    public String url;
    /**
     * 排序号
     */
    public Integer sort;
    /**
     * 图标
     */
    public String icon;
    /**
     * 实体模型
     * 可快速将相关接口与其关联
     */
    public String entityType;
    /**
     * 实体名前缀
     */
    public String   entityPrefix;
    /**
     * 菜单下属资源
     */
    public List<SysResources> sysResourcesList;

}
