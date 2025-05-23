package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 1. 一个单据号一个流水号类型
 * 2. 规则支持 固定字符 + 日期 + 流水号  三组类型自由排序组合 (字段值(待实现))
 * 3. 新增时数据时更新流水号，规则变化时重置流水号
 */

/**
 * 单据编号规则
 */
@Data
@Entity
@Table
public class FormNo extends DbEntity {
    //单据字段
    public String formFieldId;
    //规则排序
    public Integer sort;
    //序号类型
    @VField(dictCode = "FormNoType")
    public String  type;
    @VField(dictCode = "FormNoDateType")
    public String  dateType;
    //表单字段
    public String  fieldName;
    //静态文本
    public String staticText;
    //流水号位数
    public Integer snLength;
    //流水号最近值
    public Integer snLast;
    //上一个编号的日期
    public String  dateLast;
    //流水号初始值
    public Integer snStart;
    /**
     * 重置规则
     * 目前未启用，当前是根据日期类型，当日期到新的一天(月/年)时，自动重置
     */
    public String resetRule;
}
