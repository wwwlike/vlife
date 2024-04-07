package cn.wwwlike.form.req;

import cn.wwwlike.form.entity.ReportCondition;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 视图配置查询条件
 */
@Data
public class ReportConditionPageReq extends PageQuery<ReportCondition> {
    @VField(pathName = "name", opt = Opt.like)
    public String search;
    public String sysMenuId;
    public String formId;
    public String type;
}
