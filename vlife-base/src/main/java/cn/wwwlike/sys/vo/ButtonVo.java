package cn.wwwlike.sys.vo;
import cn.wwwlike.sys.entity.Button;
import cn.wwwlike.sys.entity.ButtonField;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

@Data
public class ButtonVo extends VoBean<Button> {
    public String title;
    public String icon;
    public String tooltip;
    public String resourcesEntityId;
    public String sysResourcesId;
    public String actionType;
    public String model;
    public String conditionJson;
    public List<ButtonField> fields;
    public String formFields;
    public String sysMenuId;
    public Boolean sysBtn;
    public SysResources sysResources;
}
