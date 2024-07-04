package cn.wwwlike.sys.dto;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 数据迁移对象
 */
@Data
public class UserDataMoveDto implements SaveBean<SysUser> {
    //来源
    public String id;
    //来源多个用户id
    @VField(skip = true)
    public List<String> ids;
    //目标用户
    @VField(skip = true)
    public String targetUserId;
}
