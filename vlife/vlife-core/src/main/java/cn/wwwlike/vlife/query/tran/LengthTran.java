package cn.wwwlike.vlife.query.tran;

import cn.wwwlike.vlife.query.DataExpressTran;
import com.querydsl.core.types.dsl.*;
import lombok.AllArgsConstructor;


/**
 * 查询字段长度
 */
public  class LengthTran extends DataExpressTran<SimpleExpression,NumberExpression> {
    public  NumberExpression tran(SimpleExpression expression,String dbType) {
        return ((StringPath)expression).length();
    }
}
