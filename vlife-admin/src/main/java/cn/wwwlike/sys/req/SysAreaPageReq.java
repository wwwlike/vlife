package cn.wwwlike.sys.req;

import cn.wwwlike.sys.entity.SysArea;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 地区查询条件
 */
@Data
public class SysAreaPageReq extends PageQuery<SysArea> {
    @VField(opt = Opt.like,orReqFields = {"code"})
    public String name;
    public String level;
}
