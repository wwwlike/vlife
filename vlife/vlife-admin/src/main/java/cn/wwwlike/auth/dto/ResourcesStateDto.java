package cn.wwwlike.auth.dto;

import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.IModel;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 资源批量操作dto
 */
@Data
public class ResourcesStateDto implements SaveBean<SysResources> {
    public String id;
    /**
     * 接口id
     */
    @VField(skip = true)
    public List<String> resourcesIds;


}
