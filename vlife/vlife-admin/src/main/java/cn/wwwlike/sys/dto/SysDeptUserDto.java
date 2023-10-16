package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

@Data
public class SysDeptUserDto implements SaveBean<SysDept>, ITree {
    public String id;

    public String name;
    /**
     * 编码
     */
    public String code;
    /**
     * 上级部门
     */
    public String pcode;
    /**
     * 用户
     */
    public List<String> sysUser_id;
}
