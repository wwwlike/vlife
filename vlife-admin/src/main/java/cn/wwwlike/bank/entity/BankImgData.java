package cn.wwwlike.bank.entity;


import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 图片信息表
 */
@Data
@Entity
@Table(name="bp_tmpdata_1_tb")
@VClazz(module = "bank")
public class BankImgData extends DbEntity {
    /** 批次号 */
    @VField(pathName = "bankBatchId")
    public String batchId;
    /**
     * 流水
     * `SERIAL_NO` decimal(15,0) NOT NULL COMMENT '图像唯一序号', 初始拷贝过来\
     * */
    public String bankFlowId;
    /**
     * 序号
     * 批内码 后续应该long
     * */
    public Double inccodeinBatch;

    /**  */
    public String dataFlag;
    /** 金额 */
    public Double amount;
    /** 借贷标志 */
    public String cdFlag;
    /**
     * 勾对标志
     * 勾对标志 -1 未勾对  0 强制通过  1勾对成功  5保留',
     * */
    @VField(dictCode = "BankImgData_checkFlag")
    public String checkFlag;
    /** 网点流水号 */
    public String cliSerialNo;
    /**
     * 压缩标志
     *  0 - 未压缩',
     */
    @VField(dictCode = "BankImgData_COMPRESS_FLAG")
    public String compressFlag;
    /**
     * 拷贝标志
     * 0 未拷贝 >0拷贝数',
     * */
    public Double copyRec;
    /** 识别倾斜矫正角度  */
    public String correctAng;
    /** 币种 */
    public String currencyType;
    /** 日终轧帐人员  */
    public String dayendChkWorker;
    /**
     * 是否差错图像
     *  0 非 1 是',
     * */
    public String errorFlag;
    /** 重点监督提示信息  */
    public String especialTrdDesc;
    /** 流水号 */
    public String flowId;
    /** 流水勾对对应表名  */
//    public String flowTable;
    /** 版面识别失败原因  */
    public String formFailCause;
    /** 版面组  */
    public String formGroup;
    /** 版面名称  */
    public String formName;
    /** 指定版面人员（预留字段）  */
//    public String formWorker;
    /** 扫描仪IA码  */
    public String iaCode;
    /** 图像标志  */
//    public String imageFlag;
    /** INDEX_FIELD  */
//    public String indexField;
    /**
     * 正反面标志
     *  2 含背面的正面  1 不含背面的正面  0 背面'
     */
//    public String isFrontPage;
    /** 彩色图像长度  */
    public Double lengthOfClrImg;
    /** 账号  */
    public String account;
    /** 黑白图像长度  */
    public Double lengthOfImage;
    /**
     * 凭证类型
     * 应该是字段，但是给的类型不行
     * */
    public Double vouhType;
    /** 勾对主流水的唯一序号  */
//    public String lseqId;
    /** 备注  */
    public String memo;
    /**
     * 新批内码
     * （预留字段）
     */
//    public String newInccode;
    /** OCR补录日期  */
    public String ocrDate;
    /** OCR识别失败标志  */
//    public String ocrFailCause;
    /**  OCR识别列表  */
    public String  ocrFailList;
    /** 补录人员  */
    public String ocrWorker;
    /**  OCR预处理人员 */
    public String ocrpreWorker;
    /** OCR区域列表  */
    public String ocrrectList;
    /**  彩色图像偏移位置 */
    public Double offsetOfClrImg;
    /** 黑白图像偏移位置  */
    public Double offsetOfImage;
    /**  原点位置 */
    public String oriPoint;
    /** 重点监督日期  */
    public String otherNeedDate;
    /**  重点监督人员 */
    public String otherNeedWorker;
    /**  主附件人员 */
    public String primaryWorker;
    /** 图像处理状态  */
    public String processState;
    /** 主附件状态  */
    public String psLevel;
    /**
     * 删除表
     *  0 正常 1删除 3已归档'
     */
    public String selfDelete;
    /** 图像唯一序号  */
    public Integer serialNo;
    /**  附件数目 */
    public Integer slaveCount;
    /** 科目号  */
    public String subjectNo;
    /** 交易码  */
    public String  txCode;
    /** 联号  */
    public String unitNo;
    /** 凭证号  */
    public String vouhNo;
    /**  特别处理标志 */
    public String spFlag;
    /** 差错编号  */
    public String errorNo;
    /**  新批次号 */
    public String newBatchId;
    /** 对方账号  */
    public String oppAcct;
    /**  更新标志 */
    public String updFlag;
    /** 新账号  */
    public String newAccount;
    /** 发生日期  */
    public String occurTime;
    /**
     * 非金融性描述
     * text类型
     */
//    public String noFinanceDesc;
    /** 非金融性内容  */
//    public String noFinanceCont;
    /** 合同号  */
    public String contractId;
    /** 客户端名称  */
    public String clientName;
    /**  余额 */
    public String balance;
    /** 账号类型  */
    public String accountFlag;
    /**  摘要 */
    public String resume;
    /** 第二账号  */
    public String account2;
    /**  卡号 */
    public String cardNo;
    /**  是否通过 */
    public String isPass;
    /** 是否校验  */
    public String isVerify;
    /**  校验用户 */
    public String verifyWorker;
    /**  归档日期 */
    public String archiveDate;
    /**  图像归档ID */
    public String imgId;
//    /**   */
//    public String newbatchid;
//    /**   */
//    public String yewubh;
//    /**   */
//    public String pngzhh;
    /** 重点监督分类  */
    public String auditClass;
    /** 重点监督分组  */
    public String groupNo;
    /** 上次修改时间  */
    public String lastModTime;
    /** 城市编号  */
    public String cityNo;
    /**  再监督人员 */
    public String resupervisor;
    /** 再监督具体时间  */
    public String resuperviseTime;
//    /**   */
//    public String tellerNo2;
//    /**   */
//    public String  tellerNo3;
    /**   */
//    public String jygzlzz;
    /** 利息  */
    public Double  insterest;

    /**  */
//    public String temp;

}
