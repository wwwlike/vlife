package cn.wwwlike.demo.req;

import cn.wwwlike.demo.entity.DemoProject;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 项目查询
 */
@Data
public class DemoProjectPageReq extends PageQuery<DemoProject> {
    @VField(opt = Opt.like)
    public String name;
    public List<Double> total;
    public String status;
    public Integer point;
    public List<Date> beginDate;
    public List<Date> endDate;
}
