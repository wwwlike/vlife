package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.PageApiParam;
import cn.wwwlike.form.entity.PageComponentProp;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 组件属性dto
 */
@Data
public class PageComponentPropDto implements SaveBean<PageComponentProp> {
    public String id;
//    public String pageComponentId;
    public String formFieldId;
    public String propName;
    public String subName;
    public Integer listNo;
    public String sourceType;
    public String propVal;
    public List<PageApiParam> params;
    public String relateVal;
    public String filterFunc;
    public String filterConnectionType;
}
