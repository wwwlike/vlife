package cn.wwwlike.sys.dto;

import cn.wwwlike.sys.entity.PageApiParam;
import cn.wwwlike.sys.entity.PageComponentProp;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 组件属性dto
 */
@Data
public class PageComponentPropDto extends SaveBean<PageComponentProp> {
    public String formFieldId;
    public String pageComponentId;
    public String propName;
    public String subName;
    public Integer listNo;
    public String sourceType;
    public String propVal;
    public String relateVal;
    public String conditionJson;
    public List<PageApiParam> params;
    //待移除
    public String filterFunc;
    public String filterConnectionType;
}
