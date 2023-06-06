package cn.wwwlike.bank.req;

import cn.wwwlike.bank.entity.BankBatch;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 批次查询
 */
@Data
public class BankBatchPageReq extends PageQuery<BankBatch> {
    @VField(opt = Opt.startsWith)
    public String sysDept_code;
}
