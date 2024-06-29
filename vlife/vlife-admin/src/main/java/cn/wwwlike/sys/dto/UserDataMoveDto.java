package cn.wwwlike.sys.dto;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * 数据迁移对象
 */
@Data
public class UserDataMoveDto implements SaveBean<SysUser> {
    //来源
    public String id;
    //迁移至
    @VField(skip = true)
    public String targetUserId;
}
