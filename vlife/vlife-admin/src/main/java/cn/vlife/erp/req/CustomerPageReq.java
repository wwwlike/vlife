package cn.vlife.erp.req;

import cn.vlife.erp.entity.Customer;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 客户查询
 */
@Data
public class CustomerPageReq extends PageQuery<Customer> {

    @VField(opt = Opt.like,orReqFields = {"tel","customerNo"})
    public String name;
    /**
     * 销售负责人
     */
    public String sysUserId;
}
