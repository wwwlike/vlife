package cn.wwwlike.bank.req;

import cn.wwwlike.bank.entity.BankImgData;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 图像查询
 */
@Data
public class BankImgDataPageReq extends PageQuery<BankImgData> {

    // 按批次字段查询
    /** 业务日期 */
    public List<Date> bankBatch_occurDate;
    /** 网点 */
    public String bankBatch_sysDeptId;
    /** 业务类型 */
    public String bankBatch_businessId;
    /**
     * 是否需要处理
     * 是否需要处理标志 0 不需处理 1需要处理',
     */
    public String  bankBatch_needProcess;
    /** 柜员*/
    public String  bankBatch_sysUserId;
//    精确搜索

    @VField(pathName = "account",orReqFields = {"subjectNo","flowId","vouhNo"},opt = Opt.like)
    public String search;
    /** 金额 */
    public List<Double> amount;


}

