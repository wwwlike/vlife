package cn.wwwlike.bank.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 批次
 */
@Data
@Entity
@Table(name="bp_tmpbatch_tb")
@VClazz(module = "bank")
public class BankBatch extends DbEntity {
    /** 文件服务IP */
    public String fsMachineIp;
    /** 文件服务端口 */
    public String fsMachinePort;
    /** 批次扫描图像总数 */
    public Long batchTotalPage;
    /**
     * 业务日期
     */
    public Date occurDate;
    /**
     * 网点机构
     */
    @Column(name="SITE_NO")
    public String sysDeptId;
    /**
     * 柜员
     */
    @Column(name="OPERATOR_NO")
    public String sysUserId;
    /**
     * 图像状态
     * //IMAGE_STATUS` decimal(65,30) DEFAULT NULL COMMENT '图像状态1在临时库，3在历史库;4批次表已经迁移 5,data表也迁移完毕',
     */
    @VField(dictCode = "BankBatch_ImageStatus")
    public String imageStatus;
    /**
     * 扫描员
     *`INPUT_WORKER` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '扫描录入人员',
     */
    public String inputWorker;
    /**
     * 批次是否有效
     * 0 无效  1 有效',
     */
    public String isInvalid;
    /**
     * 图像大文件路径
     */
    public String  largeFileName;
    /**
     * 银行业务类型
     */
    @VField(dictCode = "BANK_BUSINESS_TYPE")
    public String businessId;
    /**
     * 是否需要处理
     * 是否需要处理标志 0 不需处理 1需要处理',
     */
    public String  needProcess;
    /**
     * 组号
     */
    public String groupNo;
    /**
     *  批次扫描提交状态
     *   0 未提交完成  1 提交成功
     */
    @VField(dictCode = "BanBATCH_BatchCommit")
    public String batchCommit;
    /**
     * 扫描录入日期
     */
    public Date inputDate;
    /** 临时数据表名 */
    public String tempDataTable;
    /** 扫描机器号 */
    public String machineId;
    /**
     * 处理标志
     */
    @VField(dictCode = "BankBatch_ProgressFlag")
    public String progressFlag;
    /**
     * 扫描录入精确索引
     */
//    public String rigorFields;
    /** 统计标志 */
    public String workloadFlag;
    /** 扫描提交精确时间 */
    public String inputTime;

}
