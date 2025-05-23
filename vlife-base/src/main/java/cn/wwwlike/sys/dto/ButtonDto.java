package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.Button;
import cn.wwwlike.sys.entity.ButtonField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 按钮信息dto
 */
@Data
public class ButtonDto extends SaveBean<Button> {
    public String title;
    public String icon;
    public String tooltip;
    public String sysMenuId;
    public String resourcesEntityId;
    public String sysResourcesId;
    public String actionType;
    public String model;
    public String formFields;
    public String conditionJson;
    public Boolean sysBtn;
    public List<ButtonField> fields;
}
