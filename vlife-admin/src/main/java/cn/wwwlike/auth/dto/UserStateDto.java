package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.base.model.IModel;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.objship.dto.SaveDto;
import lombok.Data;

import java.util.List;


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
