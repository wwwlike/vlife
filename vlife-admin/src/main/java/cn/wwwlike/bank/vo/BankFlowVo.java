package cn.wwwlike.bank.vo;

import cn.wwwlike.bank.entity.BankFlow;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import javax.persistence.Column;

/**
 * 交易流水视图
 */
@Data
public class BankFlowVo implements VoBean<BankFlow> {
    public String id;
    /** 发生日期 */
    public String occurTime;
    /** 账号 */
    public String account;
    /** 户名 */
    public String clientName;
    /** 币种 */
    public String currencyType;
    /** 金额 */
    public Double  amount;
    /** 网点 */
    public String sysDeptId;
    /** 柜员 */
    public String sysUserId;



}
