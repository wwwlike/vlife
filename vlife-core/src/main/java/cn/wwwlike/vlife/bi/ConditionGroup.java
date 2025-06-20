package cn.wwwlike.vlife.bi;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 查询设计器对应的数据结构
 * conditionJson->序列化成此对象
 */
@Data
public class ConditionGroup {
    /**
     * 组内查询条件 and方式连接
     */
    public List<Where> where = new ArrayList<>();
}
