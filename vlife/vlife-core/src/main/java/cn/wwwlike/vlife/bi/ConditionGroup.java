package cn.wwwlike.vlife.bi;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 查询条件组
 */
@Data
public class ConditionGroup {
    /**
     * 查询主体
     */
    public String entityName;
    /**
     * 组内查询条件
     * and,组与组是or
     */
    public List<Where> where = new ArrayList<>();
}
