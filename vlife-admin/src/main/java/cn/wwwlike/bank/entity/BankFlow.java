package cn.wwwlike.bank.entity;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.*;
import java.util.Date;

/**
 * 业务流水
 */
@Entity
@Data
@Table(name = "fl_flow_tb")
@VClazz(module = "bank")
public class BankFlow extends DbEntity{
    /** 柜员号 */
    @Column(name="operatorNo")
    public String sysUserId;
    /** 网点机构 */
    @Column(name="siteNo")
    public String sysDeptId;
    /** 户名 */
    public String name;
    /** 证件标志 */
    public String certType;
    /** 证件号码 */
    public String certCode;
    /** 账号 */
    public String account;
    /** 交易码 */
    public String txCode;
    /** 交易金额 */
    public Double  amount;
    /** 科目 */
    public String subjectNo;
    /** 科目名称 */
    public String subjectName;
    /** 凭证号码 */
    public String vchrNo;
    /** 业务流水号 */
    public String flowId;
    /** 业务流水表 */
    public String flowTable;
    /** 网点流水号 */
    public String cliSerialNo;
    /** 终端标识号 */
    public String termiMark;
    /** 城市号 */
    public String cityNo;
    /** 业务日期 */
    public String occurDate;
    /** 勾对人员 */
    public String checkerNo;
    /** 卡号 */
    public String cardNo;
    /** 付方账号 */
    public String oriAccount;
    /** 把它赋值给原始主键id */
//    public Long seqId;
    /** sysDeptId  */
//    public String siteNo;
    /** sysUserId */
//    public String operatorNo;
    /** 收方账号 */
    public String oppAcct;
    /** 新账号 */
    public String newAccount;
    /** 账号标志 */
    public String accountFlag;
    /** 借贷标志  */
    public String cdFlag;
    /**
     * 业务流水序号
     *  其他表也有。是否有关联
     */
    public String seqNo;
    /** 反交易标志 */
    public Integer revtranf;
    /** 更新标识 */
    public String updFlag;
    /** 币种 */
    public String currencyType;
    /** 利息 */
    public Double insterest;
    /** 利息税 */
    public String interestTax;
    /** 主科目号 */
    public String mainSubject;
    /** 凭证类型 */
    public String vchrType;
    /** 勾对字段列表 */
    public String checkField;
    /** 勾对图像序号 */
    public String lserialNo;
    /**
     * 流水勾对标志
     * 0 未勾对   1 已勾对  3 已置流水差错
     * oracle不一致 Integer
     * */
    @VField(dictCode = "BankFlow_CheckFlag")
    public String checkFlag;
    /** 数据来源标志 */
    public String dataFlag;
    /**  */
//    public String validFlag;
    /**  */
//    public String briefCode;
    /** 编码 */
    public String code;
    /** 申请号 */
    public String appNo;
    /** 差错账号日期 */
    public String errAccDate;
    /** 转入行 */
    public String inBank;
    /** 转出行 */
    public String outBank;
    /** 余额 */
    public Double balance;
    /** 流水勾对人员 */
    public String checkWorker;
    /** 联号 */
    public String unitNo;
//    /**  */
//    public String tOperator;
//    /**  */
//    public String tReplyTime;
    /**
     * 交易金额（折美元)
     * 有下划线
     * */
    public Double t_amt;
    /**  */
//    public String tChkno;
//    /**  */
//    public String tChkdate;
//    /**  */
//    public String tExhtime;
    /**
     * 业务发生时间
     * 和oracle不一致 varchar
     * */
    public Date occurTime;
    /**  */
//    public String noFinanceDesc;
//    /**  */
//    public String noFinanceCont;
//    /**  */
//    public String servTp;
    /**
     * 合同号
     * 这里应该是有外键表
     * */
    public String contractId;
    /** 凭证号 */
    public String vouhNo;
    /** 客户名 */
    public String clientName;
    /** 重点监督描述 */
    public String especialTrdDesc;
    /** TT码 */
    public String tt;
    /** JJ码 */
    public String jj;
    /** 复核柜员 */
    public String teller_no_2;
    /** 审批柜员 */
    public String teller_no_3;
    /** 凭证类型 */
    public String vouhType;
    /**  */
//    public String dqxr;
    /** 旧网点 */
    public String oldSiteno;
    /** 借款号 */
    public String loanNo;
    /** 功能ID  */
    public String funcId;
    /**  */
//    public String businessName;
    /**  */
//    public String sxywMode;
    /** vip标志 */
    public String msgType;
    /**  */
//    public String cansleFlag;
    /**  */
//    public String flowIdBak;
    /**
     * 现转标志
     * 0-现金 1-转账 2-其他（非资金类交易）
     */
    @VField(dictCode = "BankFlow_CashTranType")
    public String cashTranType;
    /**
     * 收费标志
     * 0-不收 1-收取
     */
    @VField(dictCode = "BankFlow_FeeFlag")
    public String feeFlag;
    /**
     * 收费方式
     * 0-现金 1-转账
     */
    @VField(dictCode = "BankFlow_FeeType")
    public String feeType;
    /** 验印标志 */
    public String veriResult;
    /** 海峡业务描述  */
    public String checkResult;
    /** 汇兑报文标识号 */
    public String msgSrlNum;
    /** 汇兑标志 */
    public String msgFlag;
    /** 汇兑打印凭证号  */
    public String prtVchrNum;
    /** 汇划流水编号 */
    public String remSrlNum;
    /** 交易名称  */
    public String txName;
}
