package cn.wwwlike.erp.req;

import cn.wwwlike.erp.entity.LinkMan;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 联系人查询
 */
@Data
public class LinkManPageReq extends PageQuery<LinkMan> {
    /**
     * 联系人/邮箱/电话
     */
    @VField(pathName = "name",orReqFields = {"tel","email"},opt = Opt.like)
    public String search;
    /**
     * 职位
     */
    public String job;
    /**
     * 供应商
     */
    public String supplierId;
    /**
     * 供应商
     */
    public String customerId;
}
