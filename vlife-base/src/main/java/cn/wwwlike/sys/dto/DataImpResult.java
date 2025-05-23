package cn.wwwlike.sys.dto;

import lombok.Data;

/**
 * 数据导入结果
 */
@Data
public class DataImpResult {
    public String msg;
    //导入结果
    public boolean result;
    //总数据条数
    public Integer total;
    //导入成功条数
    public Integer success;
    // 新增条数
    public Integer add;
    // 覆盖条数
    public Integer update;
    // 因数据重复跳过数据条数
    public Integer skip;
    // 异常数据条数
    public Integer error;
    // 必填数据异常
    public Integer error_null;
}
