package cn.wwwlike.bank.vo;

import cn.wwwlike.bank.entity.BankImgData;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.Date;

@Data
public class BankImgDataVo implements VoBean<BankImgData> {
    public String id;
    /** 发生日期  */
    public Date occurTime;
    /** 账号  */
    public String account;
    /** 户名 */
    public String bankFlow_clientName;
    /** 币种 */
    public String currencyType;
    /** 金额 */
    public Double  amount;
    /** 网点 */
    public String bankFlow_sysDeptId;
    /** 柜员 */
    public String bankFlow_sysUserId;
    /** 扫描员 */
    public String bankBatch_inputWorker;
    /** 补录人员  */
    public String ocrWorker;
    /**
     * 监督人员
     * 重点监督人员
     * */
    public String otherNeedWorker;
    /**
     * 是否标志
     *  0 非 1 是', 是否差错图像
     * */
    public String errorFlag;
    /** 版面名称  */
    public String formName;
    /** 流水号 */
    public String flowId;
    /** 凭证号  */
    public String vouhNo;
    /** 交易码  */
    public String  txCode;
    /** 科目号  */
    public String subjectNo;
    /** 借贷标志 */
    public String cdFlag;
    /** 批次号 */
    public String batchId;
    /** 批内码 */
    public Integer inccodeinBatch;

    //光盘券号无

}
