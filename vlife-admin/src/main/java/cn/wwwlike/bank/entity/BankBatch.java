package cn.wwwlike.bank.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

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
    public String occurDate;

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
    public String isInvalId;
    /**
     * 图像大文件路径
     */
    public String  largeFileName;

    /**
     * 业务类型
     * 格式不对，且应该需要业务表
     */
    public Double businessId;
    /**
     * 是否需要处理
     * 是否需要处理标志 0 不需处理 1需要处理',
     */
    public String  needProcess;

    /**  凭证类型 */
    public Double vouhType;

}
