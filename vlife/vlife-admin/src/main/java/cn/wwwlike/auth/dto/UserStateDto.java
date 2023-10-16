package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 用户状态批量修改
 */
@Data
public class UserStateDto implements SaveBean<SysUser> {
    String id;
    /**
     * 批量主键iD
     */
    @VField(skip = true)
    public List<String> ids;
    public String state;


}
