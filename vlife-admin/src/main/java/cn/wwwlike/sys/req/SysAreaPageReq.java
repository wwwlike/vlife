package cn.wwwlike.sys.req;

import cn.wwwlike.sys.entity.SysArea;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.List;

/**
 * 地区查询条件
 */
@Data
public class SysAreaPageReq extends PageQuery<SysArea> {
    /**
     * 地区名称/区划编码
     */
    @VField(orReqFields = {"areacode"},opt = Opt.like)
    public String name;

    public List<String> level;
    /**
     * 行政区划
     */
    @VField(opt = Opt.startsWith)
    public String code;
}
