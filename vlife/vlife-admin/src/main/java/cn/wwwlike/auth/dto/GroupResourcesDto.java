package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysGroupResources;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 权限组dto
 * 简单模式直接关联接口资源
 */
@Data
public class GroupResourcesDto  implements SaveBean<SysGroup> {
    public String id;
    public String name;
    public String remark;
    public String filterType;
    public List<SysGroupResources> sysGroupResourcesList;
}
