package cn.wwwlike.bank.req;

import cn.wwwlike.bank.entity.BankFlow;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 业务流水查询
 */
@Data
public class BankFlowPageReq extends PageQuery<BankFlow> {

    /** 客户信息 */
    @VField(opt = Opt.like,orReqFields = {"certCode","account","txCode"})
    public String name;

    @VField(opt = Opt.startsWith)
    public String sysUser_sysDept_code;
}
