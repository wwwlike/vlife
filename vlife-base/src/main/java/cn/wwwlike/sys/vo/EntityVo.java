package cn.wwwlike.sys.vo;

import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.entity.SysApp;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;
import java.util.List;

/**
 * 模型基本信息
 */
@Data
public class EntityVo extends VoBean<Form> {
    public String title;
    public String type;
    public String state;
    public SysApp sysApp;
    @VField(skip = true)
    public List<String> parents;
    @VField(skip = true)
    public List<String> subs;
    @VField(skip = true)
    public List<String> dtos;
}
