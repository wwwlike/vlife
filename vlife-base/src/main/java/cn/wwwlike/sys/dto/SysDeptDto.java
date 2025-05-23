package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 员工配置
 */
@Data
public class SysDeptDto extends SaveBean<SysDept> {
    //部门用户
    public List<String> sysUser_id;
}
